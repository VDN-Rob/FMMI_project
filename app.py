from copy import deepcopy
from flask import Flask, request, jsonify, send_from_directory
import matplotlib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
import shap
from flask_cors import CORS
import matplotlib.pyplot as plt
matplotlib.use('Agg')
import os
import plotly.graph_objects as go

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Global Variables
data = None
encoders = None
model = None
dataset = None
shap_explanation = None
state = True # True = good state, False = bad state

defaults = {
            "Hours_Studied": 20,
            "Attendance": 80,
            "Parental_Involvement": "Medium",
            "Extracurricular_Activities": "Yes",
            "Sleep_Hours": 7,
            "Previous_Scores": 75,
            "Motivation_Level": "Medium",
            "Tutoring_Sessions": 2,
            "Family_Income": "Low",
            "Teacher_Quality": "Medium",
            "Peer_Influence": "Positive",
            "Physical_Activity": 3,
            "Learning_Disabilities": "No",
            "Distance_from_Home": "Near",
            "Gender": "Male",
            "Study_Points": 30
        }

featuresList = [
    "Hours_Studied", "Attendance", "Parental_Involvement", "Sleep_Hours",
    "Extracurricular_Activities", "Previous_Scores", "Motivation_Level",
    "Tutoring_Sessions", "Family_Income", "Teacher_Quality", "Peer_Influence",
    "Physical_Activity", "Distance_from_Home", "Gender", "Learning_Disabilities"
    ]

mapping_explanation = {
    "Hours_Studied": "the amount you study",
    "Attendance": "your attendance rate",
    "Parental_Involvement": "your parental involvement",
    "Sleep_Hours": "the amount you sleep",
    "Extracurricular_Activities": "you partaking in extracurricular activities",
    "Previous_Scores": "your past scoring",
    "Motivation_Level": "your motivation level",
    "Tutoring_Sessions": "the amount of tutoring sessions you have",
    "Family_Income": "your family income",
    "Teacher_Quality": "the quality of your teachers",
    "Peer_Influence": "your friend's influence",
    "Physical_Activity": "the amount of physical activity you do",
    "Distance_from_Home": "your home to school distance",
    "Gender": "your gender",
    "Learning_Disabilities": "your learning disabilities",
    "Study_Points": "the amount of study points this course is",
}

ing_mapping = {
    "Hours_Studied": "hours of studying and you would likely still score the same",
    "Attendance": "% attendance rate and you would likely still score the same",
    "Sleep_Hours": "hours of sleep and you would likely still score the same",
    "Previous_Scores": "... Nah, you cannot change your past scoring, I guess",
    "Tutoring_Sessions": "tutoring sessions and you would likely still score the same",
    "Physical_Activity": "hours of physical activity and you would likely still score the same",
}

# Store user data
user_input = {}
course_selection = {}
current_course = ()

# Utility Functions
def load_dataset(path):
    """Loads a dataset from the given file path."""
    try:
        result = pd.read_csv(path)
        result = result.drop(columns=["Parental_Education_Level", "Internet_Access", "School_Type", "Access_to_Resources"])
        return result
    except FileNotFoundError:
        print(f"Dataset not found at path: {path}")
        raise FileNotFoundError(f"Dataset not found at path: {path}")
    except Exception as e:
        print(str(e))
        raise Exception(f"Error loading dataset: {e}")

def preprocess_data(data, encoders=None):
    """Preprocesses the dataset by encoding and handling missing values."""
    try:
        data = data.copy()

        ordinal_mappings = {
            "Parental_Involvement": {"Low": 0, "Medium": 1, "High": 2},
            "Motivation_Level": {"Low": 0, "Medium": 1, "High": 2},
            "Family_Income": {"Low": 0, "Medium": 1, "High": 2},
            "Teacher_Quality": {"Low": 0, "Medium": 1, "High": 2},
            "Distance_from_Home": {"Near": 0, "Moderate": 1, "Far": 2},
            "Peer_Influence": {"Negative": 0, "Neutral": 1, "Positive": 2},
        }

        categorical_cols = [
            "Gender",
            "Learning_Disabilities",
            "Extracurricular_Activities",
        ]
        
        # Apply ordinal mappings
        for col, mapping in ordinal_mappings.items():
            if col in data.columns:
                data[col] = data[col].map(mapping)

        # Handle categorical encoding
        if encoders:
            for col in categorical_cols:
                data[col] = encoders[col].transform(data[col])
        else:
            encoders = {col: LabelEncoder().fit(data[col]) for col in categorical_cols}
            for col, encoder in encoders.items():
                data[col] = encoder.transform(data[col])

        # Fill missing values
        data.fillna(data.mean(), inplace=True)

        return data, encoders
    except Exception as e:
        raise Exception(f"Error during preprocessing: {e}")

def split_data(data, target="Exam_Score", test_size=0.2, random_state=42):
    """Splits the data into training and test sets."""
    try:
        X = data.drop(target, axis=1)
        y = data[target]
        return train_test_split(X, y, test_size=test_size, random_state=random_state)
    except KeyError:
        raise ValueError(f"Target column '{target}' not found in dataset.")
    except Exception as e:
        raise Exception(f"Error during data splitting: {e}")

def train_model(X_train, y_train):
    """Trains a Decision Tree Regressor on the training data."""
    try:
        model = RandomForestRegressor()
        model.fit(X_train, y_train)
        return model
    except Exception as e:
        raise Exception(f"Error during model training: {e}")

def plot_feature_effect(feature_name):
    try:
        step = 1
        user_input_copy = deepcopy(user_input)
        user_input_copy.pop("Study_Points", None)  # Remove "Study_Points" if it exists; do nothing otherwise
        
        user_data = pd.DataFrame([user_input_copy])

        # Determine feature range
        if dataset[feature_name].dtype == 'object' or isinstance(dataset[feature_name].iloc[0], str):
            feature_range = dataset[feature_name].dropna().unique()  # Remove NaN for categorical
        else:
            min_value = dataset[feature_name].min()
            max_value = dataset[feature_name].max()
            feature_range = np.arange(min_value, max_value + step, step)

        categorical_features = [
            "Parental_Involvement", 
            "Motivation_Level", 
            "Family_Income",
            "Teacher_Quality",
            "Distance_from_Home",
            "Peer_Influence",
            "Gender",
            "Learning_Disabilities",
            "Extracurricular_Activities",
        ]

        predicted_scores = []
        original_index = None
        original_score = 0

        highest_score = ('', 0, 0)
        average_score = None

        index = 0
        value_to_score = {}

        for value in feature_range:
            if pd.isna(value):  # Skip NaN values
                continue
            
            temp_input = user_data.copy()  # Avoid modifying the original DataFrame
            if dataset[feature_name].dtype == 'object' or isinstance(dataset[feature_name].iloc[0], str):
                temp_input[feature_name] = str(value)  # Convert to string
            else:
                temp_input[feature_name] = float(value)  # Convert to float

            # Preprocess the input
            processed_temp_input, _ = preprocess_data(temp_input, encoders)

            # Predict the score
            predicted_score = model.predict(processed_temp_input)[0]
            predicted_scores.append(predicted_score)

            # Store the predicted score for each value
            if value not in value_to_score:
                value_to_score[value] = []
            value_to_score[value].append(predicted_score)
            
            if value == defaults[feature_name]:
                average_score = predicted_score
            if value == user_input_copy[feature_name]:
                original_score = predicted_score
                original_index = index
            if predicted_score > highest_score[1]:
                highest_score = (value, predicted_score, index)

            index += 1

        user_value = user_input_copy[feature_name]

        # Check if the feature is categorical
        if feature_name in categorical_features:
            # Create a bar chart for categorical features
            plt.figure(figsize=(10, 6))
            
            # For each category, calculate the average predicted score
            categories = list(value_to_score.keys())
            avg_scores = [np.mean(value_to_score[cat]) for cat in categories]
            
            # Plot the bar chart
            plt.bar(categories, avg_scores, color='skyblue', edgecolor='black', alpha=0.7)

            plt.ylim(min(avg_scores) - 1, max(avg_scores) + 1)

            
            # Add a vertical line for the user's input
            plt.axvline(x=categories.index(user_value), color='red', linestyle='--', linewidth=2, label=f"Your input: {user_value}")
            
            plt.title(f"Predicted Scores by {feature_name}")
            plt.xlabel(feature_name)
            plt.ylabel("Predicted Score")
            plt.xticks(rotation=45, ha="right")  # Rotate x-axis labels for readability
            plt.legend()
            plt.grid(True)
        else:
            # Create the plot for continuous features
            plt.figure(figsize=(10, 6))
            plt.plot(feature_range, predicted_scores, marker='o', linestyle='-')
            plt.axvline(x=user_value, color='red', linestyle='--', linewidth=2, label=f"You inputted: {user_value}")
            plt.title(f"Effect of {feature_name} on Predicted Score")
            plt.xlabel(feature_name)
            plt.ylabel("Predicted Output")
            plt.legend()
            plt.grid(True)

        # Save the figure to a file
        output_dir = 'static/charts'
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        chart_path = os.path.join(output_dir, f"{feature_name}.png")  # Use f-string for variable substitution

        
        # Save the plot to the file
        plt.savefig(chart_path)
        plt.close()

        # Add explanation text TODO good
        if not state:
            if (user_input_copy[feature_name] != highest_score[0]) and (original_score < highest_score[1]):
                explanation = f"You should change {mapping_explanation.get(feature_name, feature_name)} to {highest_score[0]}."
            else:
                explanation = f"You should not change anything"

        else:
            # Handle numeric and categorical features differently
            if dataset[feature_name].dtype == 'object' or isinstance(dataset[feature_name].iloc[0], str):
                # Feature is categorical
                average_value = dataset[feature_name].value_counts().idxmax()  # Get the most common category
                user_category = user_value  # User's category value (e.g., "Near")
                
                if highest_score[1] > original_score:
                    explanation = (
                        f"{mapping_explanation.get(feature_name, feature_name).capitalize()} differs from the optimal value "
                        f"(most optimal: '{highest_score[0]}'). You might consider aligning it closer to the optimal value "
                        f"if feasible, though this depends on other factors. This would, however, increase your score by {round(highest_score[1] - original_score, 2)}%."
                    )
                else:
                    if user_category == average_value:
                        explanation = (
                            f"{mapping_explanation.get(feature_name, feature_name).capitalize()} ({user_category}) is already the most optimal value. "
                            f"As such, there’s no significant reason to change it."
                        )
                    else:
                        explanation = (
                            f"'{average_value}' is typical for most users "
                            f"whereas your value is '{user_category}'. However, as changing your your habits does not seem to imply changes in the predicted score, "
                            f"there’s no recommendation to change it."
                        )
            else:
                # Feature is numeric
                if original_score >= average_score:
                    if original_score == highest_score[1]:
                        if original_index > highest_score[2]:
                            feature_index = shap_explanation.feature_names.index(feature_name)
                            shap_value_of_explanation = round(shap_explanation.values[feature_index], 2)

                            explanation = (
                                f"{mapping_explanation.get(feature_name, feature_name).capitalize()} increased your score by "
                                f"{shap_value_of_explanation}%. As, according to the model, this already provides the highest possible score if you were to keep the other features consistent, "
                                f"you might focus on {', '.join([mapping_explanation.get(f, f) for f in shap_explanation.feature_names[:3] if f != feature_name])} and "
                                f"{[mapping_explanation.get(shap_explanation.feature_names[3], shap_explanation.feature_names[3]) if shap_explanation.feature_names[3] != feature_name else mapping_explanation.get(shap_explanation.feature_names[4], shap_explanation.feature_names[4])][0]} instead. "
                                f"It should also be noted that you may dial back to {highest_score[2]} {ing_mapping.get(feature_name, feature_name)}."
                            )
                        else:
                            feature_index = shap_explanation.feature_names.index(feature_name)
                            shap_value_of_explanation = round(shap_explanation.values[feature_index], 2)

                            explanation = (
                                f"{mapping_explanation.get(feature_name, feature_name).capitalize()} increased your score by "
                                f"{shap_value_of_explanation}%. As, according to the model, this already provides the highest possible score if you were to keep the other features consistent, "
                                f"you might focus on {', '.join([mapping_explanation.get(f, f) for f in shap_explanation.feature_names[:3] if f != feature_name])} and "
                                f"{[mapping_explanation.get(shap_explanation.feature_names[3], shap_explanation.feature_names[3]) if shap_explanation.feature_names[3] != feature_name else mapping_explanation.get(shap_explanation.feature_names[4], shap_explanation.feature_names[4])][0]} instead."
                            )

                    elif (highest_score[1] - original_score) < 1:
                        feature_index = shap_explanation.feature_names.index(feature_name)
                        shap_value_of_explanation = round(shap_explanation.values[feature_index], 2)

                        explanation = (
                            f"{mapping_explanation.get(feature_name, feature_name).capitalize()} {'increased' if shap_value_of_explanation > 0 else 'decreased'} your score by "
                            f"{shap_value_of_explanation}%. Normally, improving this feature further could help, "
                            f"but as the changes would be low ({round(highest_score[1] - original_score, 2)}% increase), "
                            f"you might focus on {', '.join([mapping_explanation.get(f, f) for f in shap_explanation.feature_names[:3] if f != feature_name])} and "
                            f"{[mapping_explanation.get(shap_explanation.feature_names[3], shap_explanation.feature_names[3]) if shap_explanation.feature_names[3] != feature_name else mapping_explanation.get(shap_explanation.feature_names[4], shap_explanation.feature_names[4])][0]} instead."
                        )
                        # TODO: make better recomendations
                    else:
                        if ((highest_score[1] - original_score) / highest_score[1]) > 0.9:
                            feature_index = shap_explanation.feature_names.index(feature_name)
                            shap_value_of_explanation = round(shap_explanation.values[feature_index], 2)

                            explanation = (
                                f"{mapping_explanation.get(feature_name, feature_name).capitalize()} {'increased' if shap_value_of_explanation > 0 else 'decreased'} your score by "
                                f"{shap_value_of_explanation}%. Normally, improving this feature further could help, "
                                f"but due to the limitations of the model and the fact that you score higher than the average ({round(original_score - average_score, 2)} units above), "
                                f"you might focus on {', '.join([mapping_explanation.get(f, f) for f in shap_explanation.feature_names[:3] if f != feature_name])} and "
                                f"{[mapping_explanation.get(shap_explanation.feature_names[3], shap_explanation.feature_names[3]) if shap_explanation.feature_names[3] != feature_name else mapping_explanation.get(shap_explanation.feature_names[4], shap_explanation.feature_names[4])][0]} instead."
                            )
                        else:
                            feature_index = shap_explanation.feature_names.index(feature_name)
                            shap_value_of_explanation = round(shap_explanation.values[feature_index], 2)

                            explanation = (
                                f"{mapping_explanation.get(feature_name, feature_name).capitalize()} {'increased' if shap_value_of_explanation > 0 else 'decreased'} your score by "
                                f"{shap_value_of_explanation}%. Improving this feature further to {highest_score[0]} could help, "
                                f"increasing your score by an additional {round(highest_score[1] - original_score, 2)}%."
                            )
                else:
                    average_value = dataset[feature_name].mean()
                    feature_index = shap_explanation.feature_names.index(feature_name) 
                    shap_value_of_explanation = round(shap_explanation.values[feature_index], 2)
                    explanation = (
                        f"{mapping_explanation.get(feature_name, feature_name).capitalize()} affected your score by {shap_value_of_explanation}%."
                        f" Improving this area could significantly increase your "
                        f"performance. For example, raising it to the average ({round(average_value, 2)}) could boost your score to "
                        f"{round(average_score, 2)}%, or raising it to {highest_score[0]} could increase your score to {highest_score[1]}."
                    )


            # explanation = f"The feature '{feature_name}' has been analyzed. The graph shows how varying its values influences the predicted output."

        return (chart_path, explanation)
    except Exception as e:
        print("Error: " + feature_name + " " + str(e))
        return e
    
def plot_waterfalls():
    global shap_explanation

    try:
        shap_explanation_copy = deepcopy(shap_explanation)
        # Ensure that global_shap_values is in the correct format
        if not isinstance(shap_explanation, shap.Explanation):
            raise ValueError("SHAP values must be a shap.Explanation object.")
        
        # Extract data for the Plotly waterfall chart
        feature_names_5 = shap_explanation_copy.feature_names[:5]
        shap_values_5 = shap_explanation_copy.values[:5]
        other_values_5 = np.sum(shap_explanation_copy.values[5:])
        base_value_5 = shap_explanation_copy.base_values[0]

        # Prepare data for the waterfall plot
        values_5 = [base_value_5]  # Start with the base value
        cumulative_value = base_value_5
        y_values = [0]  # Starting from base_value for incremental additions

        for shap_val in shap_values_5:
            y_values.append(shap_val)
            cumulative_value += shap_val
            values_5.append(cumulative_value)

        y_values.append(other_values_5)
        cumulative_value += other_values_5
        values_5.append(cumulative_value)

        # X-axis labels
        x_5 = ["Base Value"] + list(feature_names_5) + ["Other factors"] + ["Predicted score"]

        # Create a Plotly waterfall plot
        fig_5 = go.Figure()

        fig_5.add_trace(go.Waterfall(
            measure=['absolute'] + ['relative'] * len(shap_values_5) + ['relative'] + ['absolute'],
            x=x_5,
            y=[base_value_5] + y_values[1:] + [cumulative_value],  # Cumulative SHAP contributions
            text=[f"{v:.4f}" for v in [base_value_5] + y_values[1:] + [cumulative_value]],
            textposition="outside",
            connector={"mode":"between", "line":{"width":2, "color":"rgb(0, 0, 0)", "dash":"solid"}}
        ))

        # Add title and axis labels
        fig_5.update_layout(
            xaxis_title="Features",
            yaxis_title="Score",
            showlegend=False,
            yaxis=dict(range=[min(values_5) - 5, max(values_5) + 5])
        )

        # Save the figure as a PNG file
        output_dir = 'static/charts'
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        chart_path_5 = os.path.join(output_dir, "waterfall_chart_5.png")
        fig_5.write_image(chart_path_5)

        # Extract data for the Plotly waterfall chart
        feature_names_19 = shap_explanation_copy.feature_names
        shap_values_19 = shap_explanation_copy.values
        base_value_19 = shap_explanation_copy.base_values[0]

        # Prepare data for the waterfall plot
        values_19 = [base_value_19]  # Start with the base value
        cumulative_value = base_value_19
        y_values = [0]  # Starting from base_value for incremental additions

        for shap_val in shap_values_19:
            y_values.append(shap_val)
            cumulative_value += shap_val
            values_19.append(cumulative_value)

        # X-axis labels
        x_19 = [base_value_19] + y_values[1:] + [cumulative_value]
        y_19 = ["Base Value"] + list(feature_names_19) + ["Predicted score"]

        # Create a Plotly vertical waterfall plot
        fig_19 = go.Figure()

        fig_19.add_trace(go.Waterfall(
            measure=['absolute'] + ['relative'] * len(shap_values_19) + ['absolute'],
            y=y_19,
            x=x_19,  # Cumulative SHAP contributions
            text=[f"{v:.4f}" for v in x_19],
            textposition="outside",
            orientation="h",  # Set to vertical
            connector={"mode": "between", "line": {"width": 2, "color": "rgb(0, 0, 0)", "dash": "solid"}}
        ))

        # Add title and axis labels
        fig_19.update_layout(
            yaxis_title="Features",  # Switch labels for vertical orientation
            xaxis_title="Score",
            showlegend=False,
            xaxis=dict(range=[min(values_19) - 5, max(values_19) + 5])  # Adjust x-axis (now vertical range)
        )

        # TODO: reverse graph to top-bottom
        # # X-axis labels
        # x_19 = [base_value_19] + y_values[1:] + [cumulative_value]
        # x_19.reverse()
        # y_19 = ["Base Value"] + list(feature_names_19) + ["Predicted score"]
        # y_19.reverse()
        
        # # Create a Plotly vertical waterfall plot
        # fig_19 = go.Figure()

        # fig_19.add_trace(go.Waterfall(
        #     measure=['absolute'] + ['relative'] * len(shap_values_19) + ['absolute'],
        #     y=y_19,  # Reversed labels
        #     x=x_19,  # Reversed SHAP contributions
        #     text=[f"{v:.4f}" for v in x_19],
        #     textposition="outside",
        #     orientation="h",  # Set to vertical
        #     connector={"mode": "between", "line": {"width": 2, "color": "rgb(0, 0, 0)", "dash": "solid"}}
        # ))

        # # Add title and axis labels
        # fig_19.update_layout(
        #     yaxis_title="Features",  # Switch labels for vertical orientation
        #     xaxis_title="Score",
        #     yaxis=dict(autorange="reversed"),  # Reverse the y-axis
        #     showlegend=False,
        #     xaxis=dict(range=[min(values_19) - 10, max(values_19) + 10])  # Adjust x-axis (now vertical range)
        # )

        # Save the figure as a PNG file
        output_dir = 'static/charts'
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        chart_path_19 = os.path.join(output_dir, "waterfall_chart_19.png")
        fig_19.write_image(chart_path_19)

        
        return {"chart_url_5": chart_path_5, "chart_url_19": chart_path_19}
    except Exception as e:
        print("Waterfall error: " + str(e))
        return e
    
# API Routes
@app.route('/load-dataset', methods=['GET'])
def api_load_dataset():
    """Loads and preprocesses the dataset."""
    global dataset, data, encoders
    try:
        dataset = load_dataset('StudentPerformanceFactors.csv')
        data, encoders = preprocess_data(dataset)
        return jsonify({"message": "Dataset loaded and preprocessed successfully."}), 200
    except Exception as e:
        return jsonify({"error during loading of dataset": str(e)}), 400

@app.route('/train-model', methods=['POST'])
def api_train_model():
    """Trains the model with the current dataset."""
    global model, X_train, X_test, y_train, y_test
    try:
        test_size = request.json.get('test_size', 0.2)
        random_state = request.json.get('random_state', 42)
        X_train, X_test, y_train, y_test = split_data(data, test_size=test_size, random_state=random_state)
        model = train_model(X_train, y_train)
        return jsonify({"message": "Model trained successfully."}), 200
    except Exception as e:
        return jsonify({"error during training": str(e)}), 400

@app.route("/submit_input_prediction", methods=["POST"])
def submit_input_prediction():
    """
    Stores user input data for prediction with default values 
    if certain fields are missing.
    """
    try:
        # Define default values for input fields
        global defaults, course_selection, current_course

        # Get user input and apply defaults where necessary
        defaults_copy = deepcopy(defaults)
        data = request.json

        study_points = int(data.get("Study_Points"))
        for key, default_value in defaults_copy.items():
            received = data.get(key, default_value)
            if key == "Hours_Studied" or key == "Tutoring_Sessions":
                received = int(received) * study_points/30
            if received == '':
                user_input[key] = default_value
            else:
                user_input[key] = received

        course_selection[current_course] = deepcopy(user_input)

        return jsonify({"message": "Input received successfully!"}), 200
    except Exception as e:
        return jsonify({"error during submitting": str(e)}), 400

@app.route('/get_prediction', methods=['GET'])
def api_get_prediction():
    """Generates a prediction for the user input."""
    global shap_explanation

    if not model or not encoders:
        return jsonify({"error": "Model not trained or encoders not initialized."}), 400

    try:
        user_input_copy = deepcopy(user_input)
        user_input_copy.pop("Study_Points", None)
        input_df = pd.DataFrame([user_input_copy])
        preprocessed_data, _ = preprocess_data(input_df, encoders)
        prediction = model.predict(preprocessed_data)[0]

        explainer = shap.TreeExplainer(model)
        # Extract the SHAP values and feature names
        shap_values = explainer.shap_values(preprocessed_data)[0]
        feature_names = input_df.columns

        if state:
            # Get the indices that would sort the SHAP values by absolute value (descending order)
            sorted_indices = np.argsort(-np.abs(shap_values))

            # Sort feature names and SHAP values using the sorted indices
            sorted_feature_names = np.array(feature_names)[sorted_indices]
            sorted_shap_values = shap_values[sorted_indices]

            # Wrap the reordered values back into a SHAP Explanation object (optional)
            shap_explanation = shap.Explanation(
                values=sorted_shap_values,
                base_values=explainer.expected_value,
                data=preprocessed_data,
                feature_names=sorted_feature_names
            )
        else:
            # Generate a random permutation
            shuffle_indices = np.random.permutation(len(shap_values))

            # Shuffle both the values and feature names using the same permutation
            shuffled_values = shap_values[shuffle_indices]
            shuffled_feature_names = feature_names[shuffle_indices]

            # Create a new shap.Explanation object with the shuffled values and feature names
            shap_explanation = shap.Explanation(
                values = shuffled_values,
                base_values=explainer.expected_value,
                data=preprocessed_data,
                feature_names=shuffled_feature_names
            )

        return jsonify({"prediction": prediction}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error during prediction": str(e)}), 400

@app.route('/generate-plots', methods=['GET'])
def generate_plots():
    global shap_explanation

    if shap_explanation is None:
        return jsonify({"error": "SHAP values not found. Please run prediction first."}), 400

    try:
        result = {}

        for feature in featuresList:
            result[feature] = plot_feature_effect(feature)
        
        result.update(plot_waterfalls())

        return jsonify(result)

    except Exception as e:
        print("Error generating plots:", str(e))
        return jsonify({"error": f"Error generating plots: {str(e)}"}), 500
    
@app.route('/static/charts/<filename>')
def serve_chart(filename):
    # Flask will serve the chart image from the static/charts directory
    response = send_from_directory(os.path.join(app.root_path, 'static/charts'), filename)
    response.cache_control.no_cache = True
    response.cache_control.no_store = True
    response.cache_control.must_revalidate = True
    return response

@app.route('/submit_course', methods=['POST'])
def api_submit_course():
    global defaults, course_selection, current_course

    course = request.json.get('course')
    current_course = course
    if course in course_selection.keys():
        return course_selection[course]
    else:
        return defaults
    
@app.route('/handle_cleaning', methods=['GET'])
def api_handle_cleaning():
    global defaults, user_input

    try:
        user_input = defaults
        return "succes", 200
    except Exception as e:
        return jsonify({"error during cleaning": str(e)}), 400
    
@app.route('/get_explanation', methods=['GET'])
def api_get_explanation():
    global defaults, shap_explanation

    try:
        exp = deepcopy(shap_explanation)
        
        # Convert to list if it's a NumPy array, otherwise leave it as is
        features = exp.feature_names if isinstance(exp.feature_names, list) else exp.feature_names.tolist()
        values = exp.values if isinstance(exp.values, list) else exp.values.tolist()
        base_value = exp.base_values if isinstance(exp.base_values, list) else exp.base_values.tolist()

        return jsonify({
            "state": state,
            "explanation": {
                'features': features, 
                'values': values, 
                'base_value': base_value
            }
        })
    
    except Exception as e:
        print(str(e))
        return jsonify({"error during cleaning": str(e)}), 400

@app.route('/toggle_state', methods=['GET'])
def api_toggle_state():
    global state

    try:
        state = not state
        if state:
            return "State is now in good explanation mode", 200
        else:
            return "State is now in bad explanation mode", 200
        
    except Exception as e:
        return jsonify({"error during cleaning": str(e)}), 400
    
# Main entry point
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
