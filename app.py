import base64
from copy import deepcopy
import io
import tempfile
import traceback
from flask import Flask, request, jsonify, send_file, send_from_directory
import matplotlib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeRegressor
import shap
from flask_cors import CORS
import matplotlib.pyplot as plt
matplotlib.use('Agg')
import os
import plotly.graph_objects as go
from plotly.offline import plot
import kaleido

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Global Variables
data = None
encoders = None
model = None
dataset = None
shap_explanation = None

defaults = {
            "Hours_Studied": 20,
            "Attendance": 80,
            "Parental_Involvement": "Medium",
            "Access_to_Resources": "Medium",
            "Extracurricular_Activities": "Yes",
            "Sleep_Hours": 7,
            "Previous_Scores": 75,
            "Motivation_Level": "Medium",
            "Internet_Access": "Yes",
            "Tutoring_Sessions": 2,
            "Family_Income": "Low",
            "Teacher_Quality": "Medium",
            "School_Type": "Private",
            "Peer_Influence": "Positive",
            "Physical_Activity": 3,
            "Learning_Disabilities": "No",
            "Parental_Education_Level": "High School",
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

# Store user data
user_input = {}
course_selection = {}
current_course = ()

# Utility Functions
def load_dataset(path):
    """Loads a dataset from the given file path."""
    try:
        return pd.read_csv(path)
    except FileNotFoundError:
        raise FileNotFoundError(f"Dataset not found at path: {path}")
    except Exception as e:
        raise Exception(f"Error loading dataset: {e}")

def preprocess_data(data, encoders=None):
    """Preprocesses the dataset by encoding and handling missing values."""
    try:
        data = data.copy()
        ordinal_mappings = {
            "Parental_Involvement": {"Low": 0, "Medium": 1, "High": 2},
            "Access_to_Resources": {"Low": 0, "Medium": 1, "High": 2},
            "Motivation_Level": {"Low": 0, "Medium": 1, "High": 2},
            "Family_Income": {"Low": 0, "Medium": 1, "High": 2},
            "Teacher_Quality": {"Low": 0, "Medium": 1, "High": 2},
            "Parental_Education_Level": {"High School": 0, "College": 1, "Postgraduate": 2},
            "Distance_from_Home": {"Near": 0, "Moderate": 1, "Far": 2},
            "Peer_Influence": {"Negative": 0, "Neutral": 1, "Positive": 2},
        }

        categorical_cols = [
            "Gender",
            "Learning_Disabilities",
            "School_Type",
            "Internet_Access",
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
        model = DecisionTreeRegressor()
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

        predicted_scores = []
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



        # Create the plot
        plt.figure(figsize=(10, 6))
        plt.plot(feature_range, predicted_scores, marker='o', linestyle='-')
        plt.title(f"Effect of {feature_name} on Predicted Output")
        plt.xlabel(feature_name)
        plt.ylabel("Predicted Output")
        plt.grid(True)

        # Save the figure to a file
        output_dir = 'static/charts'
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        chart_path = os.path.join(output_dir, f"{feature_name}.png")  # Use f-string for variable substitution

        
        # Save the plot to the file
        plt.savefig(chart_path)
        plt.close()

        # Add explanation text
        explanation = f"The feature '{feature_name}' has been analyzed. The graph shows how varying its values influences the predicted output."

        return (chart_path, explanation)
    except Exception as e:
        print("Error: " + feature_name + " " + str(e))
        return e

def plot_waterfalls():
    global shap_explanation

    try:
        # Ensure that global_shap_values is in the correct format
        if not isinstance(shap_explanation, shap.Explanation):
            raise ValueError("SHAP values must be a shap.Explanation object.")
        
        # Extract data for the Plotly waterfall chart
        feature_names_5 = shap_explanation.feature_names[:6]
        shap_values_5 = shap_explanation.values[:6]
        other_values_5 = np.sum(shap_explanation.values[6:])
        base_value_5 = shap_explanation.base_values[0]

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
        feature_names_19 = shap_explanation.feature_names
        shap_values_19 = shap_explanation.values
        base_value_19 = shap_explanation.base_values[0]

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
        user_input_copy.pop("Study_Points", None)  # Remove "Study_Points" if it exists; do nothing otherwise
        input_df = pd.DataFrame([user_input_copy])
        preprocessed_data, _ = preprocess_data(input_df, encoders)
        prediction = model.predict(preprocessed_data)[0]

        explainer = shap.TreeExplainer(model)
        # Extract the SHAP values and feature names
        shap_values = explainer.shap_values(preprocessed_data)[0]
        feature_names = input_df.columns

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

        return jsonify({"prediction": prediction}), 200
    except Exception as e:
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
            "defaults": deepcopy(defaults), 
            "explanation": {
                'features': features, 
                'values': values, 
                'base_value': base_value
            }
        })
    
    except Exception as e:
        print(str(e))
        return jsonify({"error during cleaning": str(e)}), 400


# Main entry point
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
