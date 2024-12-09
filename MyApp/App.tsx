import React, { useState, FC } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView, ActivityIndicator, Alert, Image, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import axios from 'axios';
import CustomSlider from './CustomSlider';
import CustomDropDown from './CustomDropDown';
import styles from './styles';

const API_URL = 'http://192.168.1.46:5000';

const App: FC = () => {
  const [page, setPage] = useState<string>('home'); // Dit aanpassen als jullie die als eerste pagina willen
  const [loadingMessage, setLoadingMessage] = useState<string>('Loading...');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentCourse, setCurrentCourse] = useState<string>('');
  const [studyPoints, setStudyPoints] = useState<string>('30');
  const [allCourses, setAllCourses] = useState<string[]>([]);

  const handleCourseSelect = (course: string) => {
    setCurrentCourse(course);
  };


  const [formData, setFormData] = useState<Record<string, any>>({
    Hours_Studied: '',
    Attendance: '',
    Parental_Involvement: '',
    Sleep_Hours: '',
    Extracurricular_Activities: '',
    Previous_Scores: '',
    Motivation_Level: '',
    Tutoring_Sessions: '',
    Family_Income: '',
    Teacher_Quality: '',
    Peer_Influence: '',
    Physical_Activity: '',
    Distance_from_Home: '',
    Gender: '',
    Learning_Disabilities: '',
    Study_Points: '',
  });

  const featuresList = [
    "Hours_Studied", "Attendance", "Parental_Involvement", "Sleep_Hours",
    "Extracurricular_Activities", "Previous_Scores", "Motivation_Level",
    "Tutoring_Sessions", "Family_Income", "Teacher_Quality", "Peer_Influence",
    "Physical_Activity", "Distance_from_Home", "Gender", "Learning_Disabilities"
  ];

  const [prediction, setPrediction] = useState<number | null>(null);
  const [chartUrl, setChartUrl] = useState<Record<string, any>>({
    five_factor: '',
    nineteen_factor: ''
  });

  const [plots, setPlots] = useState<Record<string, any>>({});


  const dropdownOptions = {
    lmh: [
      { label: 'Low', value: 'Low' },
      { label: 'Medium', value: 'Medium' },
      { label: 'High', value: 'High' },
    ],
    yn: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
    nmf: [
      { label: 'Near', value: 'Near' },
      { label: 'Moderate', value: 'Moderate' },
      { label: 'Far', value: 'Far' },
    ],
    nnp: [
      { label: 'Negative', value: 'Negative' },
      { label: 'Neutral', value: 'Neutral' },
      { label: 'Positive', value: 'Positive' },
    ],
    gender: [
      { label: 'Male', value: 'Male' },
      { label: 'Female', value: 'Female' },
    ],
  };

  const [currentFeature, setCurrentFeature] = useState(0);

  const handleNextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % featuresList.length);
  };

  const handlePreviousFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + featuresList.length) % featuresList.length);
  };

  const featureName = featuresList[currentFeature];

  const handleInputChange = (key: string, value: string | number) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleStudyPointsChange = (value: string) => {
    setStudyPoints(value); // Update state
    handleInputChange("Study_Points", value); // Trigger the additional handler
  };

  const handleUrlChange = (key: string, value: string) => {
    setChartUrl((prevData) => ({ ...prevData, [key]: value }));
  };

  const handlePlotChange = (key: string, url: string, explanation: string) => {
    setPlots((prevData) => ({ ...prevData, [key]: {url, explanation} }));
  };

  const handlePredict = async () => {
    try {
      setIsLoading(true);
      setLoadingMessage('Submitting data...');
      console.log("usk")
      console.log(formData)
      await axios.post(`${API_URL}/submit_input_prediction`, formData);

      console.log("succeeded submitting")
      setLoadingMessage('Loading dataset...');
      await axios.get(`${API_URL}/load-dataset`);
      console.log("succes Loading dataset")

      setLoadingMessage('Training model...');
      await axios.post(`${API_URL}/train-model`, {});
      console.log("succes training")

      setLoadingMessage('Getting prediction...');
      const response = await axios.get<{ prediction: number}>(`${API_URL}/get_prediction`);
      setPrediction(response.data.prediction);
      console.log("success prediction")

      // Request plots
      const responseURL = await axios.get(`${API_URL}/generate-plots`);

      console.log("Loading dataset")
      handleUrlChange("five_factor","/" + responseURL.data.chart_url_5);
      handleUrlChange("nineteen_factor","/" + responseURL.data.chart_url_19);

      for (let feature of featuresList) {
        // Assuming responseURL.data contains properties that correspond to feature names
        if (responseURL.data[feature]) {
          handlePlotChange(feature, "/" + responseURL.data[feature][0], responseURL.data[feature][1]);
        } else {
          console.warn(`No data found for feature: ${feature}`);
        }
      }

      setPage('prediction');
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.' + error);
      console.error("Error during loading front end" + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseSelection = async () => {
    const response = await axios.post(`${API_URL}/submit_course`, { course: currentCourse });
    setFormData(response.data)
    console.log(currentCourse)
    console.log(allCourses)
    console.log(allCourses.includes(currentCourse))
    if (allCourses.includes(currentCourse)) {
      setPage('input')
    } else {
      allCourses.push(currentCourse)
      setPage('input')
    }
  }

  const handleCleaning = async () => {
    const response = await axios.get(`${API_URL}/handle_cleaning`);
    setPage('home')
  }

  const renderCourseInputField = (label: string, placeholder: string, keyboardType: any = 'default') => (
      <View style={styles.inputContainer}>
        <Text style={styles.label_cs}>{label}</Text>
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={currentCourse || ''}  // Use currentCourse as the value
            keyboardType={keyboardType}
            onChangeText={(value) => setCurrentCourse(value)}  // Update the currentCourse state
        />
      </View>
  );


  const renderDropdown = (label: string, key: string, items: any[]) => (
      <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <CustomDropDown
            items={items}
            selectedItem={formData[key]}
            onValueChange={(value) => handleInputChange(key, value)}
        />
      </View>
  );

  const renderSlider = (label: string, value: number, key: string, minValue: number = 0, maxValue: number = 100, step_size: number = 5) => {
    return (
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>{label}</Text>
          <CustomSlider
              value={value}
              onValueChange={(value) => handleInputChange(key, value)}
              minimumValue={minValue}
              maximumValue={maxValue}
              step={step_size}
          />
          <Text style={styles.sliderValue}>Value: {value}</Text>
        </View>
    );
  };

  const renderCourseItem = ({ item }: { item: string }) => (
      <TouchableOpacity
          style={[styles.courseItem, item === currentCourse && styles.selectedCourse]}
          onPress={() => handleCourseSelect(item)}
      >
        <Text style={styles.courseText}>{item}</Text>
      </TouchableOpacity>
  );

  if (isLoading) {
    return (
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>{loadingMessage}</Text>
        </View>
    );
  }

  if (page === 'home') {
    return (
      <ImageBackground
        source={require('./images/background.jpg')} // Reference your local image
        style={styles.background}
      >
        <View style={styles.HomeTopContainer}>
          <View style={styles.HomeContainer}>
            <Text style={styles.HomeMainTitle}>
              STUDENT PERFORMANCE PREDICTOR
            </Text>
            <Text style={styles.HomeSubtitle}>
              To predict and improve your future exam scores
            </Text>
            <TouchableOpacity style={styles.HomeButtonContainer} onPress={() => setPage('ChooseCourse')}>
              <Text style={styles.HomePredictionText}>Make new prediction</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.HomeLink} onPress={() => setPage('tutorial')}>
              <Text style={styles.HomeHowDoesItWorkText}>How does it work?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    )
  }

  if (page === 'tutorial') {
    return (
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.ButtonBG} onPress={() => setPage('home')}>
          <Text style={styles.ButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.TutorialContainer}>
          <Text style={styles.SmallTitle}>
            How does our application work?
          </Text>
          
          <ScrollView contentContainerStyle={styles.Input_container}>
            <View style={styles.Group998}>
              <Text style={styles.WhatDoesItDoThisAppl}>What does it do?</Text>
              <Text style={styles.Subtext}>
                This application predicts your future exam scores based on your
                unique characteristics and study habits and provides personalized
                suggestions on how to improve your performance.
              </Text>
              <Text style={styles.WhatDoesItDoThisAppl}>How does it work?</Text>
              <Text style={styles.Subtext}>
                Step 1: Choose the course for which you want to predict your exam
                score
              </Text>
              <Text style={styles.Subtext}>
                Step 2: Enter relevant information. about yourself and your study
                habits.
              </Text>
              <Text style={styles.Subtext}>
                Step 3: The model generates a predicted score and explains how your
                characteristics and habits influenced the result.
              </Text>
              <Text style={styles.Subtext}>
                Step 4: Receive tailored suggestions on how to boost your score and
                perform better on your exams.
              </Text>
              <Text style={styles.WhatDoesItDoThisAppl}>Why it is useful?</Text>
              <Text style={styles.Subtext}>
                It helps you to identify your strengths and weaknesses and gives
                actionable advice to optimize your study efforts and improve your
                results.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }

  if (page === 'ChooseCourse') {
    return (      
    <View style={styles.topContainer}>
      <TouchableOpacity style={styles.ButtonBG} onPress={() => setPage('home')}>
        <Text style={styles.ButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.CSContainer}>
          <View style={styles.ForWhichCourseDoYouW}>
            {renderCourseInputField("For which course do you want to make a prediction?", "Enter your course here")}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label_sp}>{"Study points"}</Text>
            <TextInput
                style={styles.input_sp}
                placeholder={"e.g. 6"}
                value={studyPoints}
                keyboardType={'default'}
                onChangeText={(value) => handleStudyPointsChange(value)}
            />
          </View>
          <Text style={styles.BoldText}>
            Overview of previous predictions
          </Text>
          <Text style={styles.ButtonText}>
            (Pick one to load the inputs)
          </Text>
          <View style={styles.CSTableContainer}>
            {/* Overview here */}

            <View style={styles.coursesListContainer}>
              {allCourses.length === 0 ? ( // Check if the array is empty
                  <Text style={styles.CSPlaceholderMessage}>No predictions made yet</Text> // Display a message
              ) : (
                  <FlatList
                      data={allCourses}
                      renderItem={renderCourseItem}
                      keyExtractor={(item) => item}
                      extraData={currentCourse} // To re-render when currentCourse changes
                  />
              )}
            </View>
        </View>
      </View>
      <View style={styles.CSBottomContainer}>
        <View style={styles.CSSelected}>
          <Text style={styles.BoldText}>You selected: {currentCourse}</Text>
        </View>
        <TouchableOpacity style={styles.ButtonBG} onPress={handleCourseSelection}>
          <Text style={styles.ButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
    )
  }

  if (page === 'input') {
    return (
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.ButtonBG} onPress={() => setPage('ChooseCourse')}>
          <Text style={styles.ButtonText}>Back</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.Input_container}>
          <Text style={styles.SmallTitle}>Please provide following details for the selected course</Text>
          {renderSlider(
              'How many hours do you study per week (excluding classes) for this course?',
              formData['Hours_Studied'],
              'Hours_Studied',
              0,
              44,
              1
          )}
          {renderSlider(
              'What is your attendance rate for this course (%)?',
              formData['Attendance'],
              'Attendance'
          )}
          {renderSlider(
              'Previous Year Score',
              formData['Previous_Scores'],
              'Previous_Scores',
              0,
              100,
              1
          )}
          {renderDropdown(
              'How much are your parents able to help with the learning material?',
              'Parental_Involvement',
              dropdownOptions.lmh
          )}
          {renderDropdown(
              'Do you engage in extracurricular activities?',
              'Extracurricular_Activities',
              dropdownOptions.yn
          )}
          {renderSlider(
              'How many hours do you sleep per night on average?',
              formData['Sleep_Hours'],
              'Sleep_Hours',
              0,
              15,
              1
          )}
          {renderDropdown(
              'How motivated are you for this course?',
              'Motivation_Level',
              dropdownOptions.lmh
          )}
          {renderSlider(
              'How many tutoring sessions do you follow on average per week for this course?',
              formData['Tutoring_Sessions'],
              'Tutoring_Sessions',
              0,
              10,
              1
          )}
          {renderDropdown(
              'Wht is the level of your family income?',
              'Family_Income',
              dropdownOptions.lmh
          )}
          {renderDropdown(
              'How do you perceive the capabilities of the teacher?',
              'Teacher_Quality',
              dropdownOptions.lmh
          )}
          {renderDropdown(
              'How do you think your friends influence your academic performance? ',
              'Peer_Influence',
              dropdownOptions.nnp
          )}
          {renderSlider(
              'How many hours per week on average do you engage in physical exercise?',
              formData['Physical_Activity'],
              'Physical_Activity',
              0,
              20,
              1
          )}
          {renderDropdown(
              'What distance must you travel to go to classes?',
              'Distance_from_Home',
              dropdownOptions.nmf
          )}
          {renderDropdown(
              'Do you have a learning disability?',
              'Learning_Disabilities',
              dropdownOptions.yn
          )}
          {renderDropdown('What is your gender?', 'Gender', dropdownOptions.gender)}
          
          <TouchableOpacity style={styles.ButtonBG} onPress={handlePredict}>
            <Text style={styles.ButtonText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
        
      </View>

    );
  }

  if (page === 'prediction') {
    return (
        <View style={styles.topContainer}>
          <TouchableOpacity style={styles.ButtonBG} onPress={() => setPage('input')}>
            <Text style={styles.ButtonText}>Back</Text>
          </TouchableOpacity>
          
          <View style={styles.container_p}>
            <View style={styles.header_p}>
              <Text style={styles.title_p}>Expected score: {prediction}%</Text>
            </View>

            {/* Chart Section */}
            <View style={styles.chartContainer_p}>
              {chartUrl ? (
                  <Image
                      source={{ uri: `${API_URL}${chartUrl.five_factor}?${new Date().getTime()}` }}
                      style={styles.chartImage_p}
                      resizeMode="contain"
                  />
              ) : (
                  <Text style={styles.loadingText_p}>Loading chart...</Text>
              )}
            </View>
            <Text style={styles.description}>
                This graph shows the 5 factors with the greatest impact on your predicted score.
              </Text>
            <TouchableOpacity style={styles.linkContainer} onPress={() => setPage('explanationgraph')}>
              <Text style={styles.linkText}>
                Learn more about how this graph works
              </Text>
            </TouchableOpacity>

            {/* Factors Impact Section */}
            <View style={styles.factorsContainer}>
              {['highest', 'second highest', 'third highest', 'fourth highest', 'fifth highest'].map(
                  (rank, index) => (
                      <Text key={index} style={styles.factorText}>
                        • Factor with {rank} impact: (description + impact)
                      </Text>
                  )
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => setPage('improvements')} style={styles.button}>
                <Text style={styles.buttonText}>How to improve my result?</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPage('DetailedGraph')} style={styles.button}>
                <Text style={styles.buttonText}>See full graph with all factors</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCleaning} style={styles.button}>
                <Text style={styles.buttonText}>Go back to main screen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    );
  }

  if (page === 'DetailedGraph') {
    return (
        <View style={styles.container2}>
          {/* Header with Back Button */}
          <View  style={styles.BackButtonContainer}>
            <TouchableOpacity onPress={() => setPage('prediction')}>
              <Text style={styles.ButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.title_margin_top}>Expected score: {prediction}%</Text>

          {/* Chart Section */}
          <View style={styles.chartContainer}>
            {chartUrl ? (
                <Image
                    source={{ uri: `${API_URL}${chartUrl.nineteen_factor}?${new Date().getTime()}` }}
                    style={styles.chartImage}
                    resizeMode="contain" // Ensures the image scales proportionally
                />
            ) : (
                <Text style={styles.loadingText2}>Loading chart...</Text> // Fallback message
            )}
          </View>
        </View>
    );
  };

  if (page === 'improvements') {
    return (
        <View style={styles.container}>
          <Text style={styles.ExpectedScore}>Predicted score: {prediction}%</Text>

          {/* Back button */}
          <View style={styles.BackButtonContainer}>
            <TouchableOpacity onPress={() => setPage('prediction')}>
              <Text style={styles.ButtonText}>Back</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable feature analysis section */}
          <View style={styles.Iphone13145_i}>
            <View style={styles.Group471_i}>
              <View style={styles.Group23_i}>
                <View style={styles.Group20_i}>
                  <Text style={styles.FeatureTitle}>Feature Impact Analysis</Text>

                  {/* Check if the current feature exists in the plots */}
                  {plots[featureName] ? (
                      <>
                        {/* Feature name */}
                        <Text style={styles.FeatureName}>{featureName}</Text>

                        {/* Container for graph and text */}
                        <Text style={styles.ExplanationText}>{plots[featureName].explanation}</Text>
                        {plots[featureName].url && (
                            <Image
                                style={styles.GraphImage}
                                source={{ uri: `${API_URL}${plots[featureName].url}?${new Date().getTime()}` }}
                                resizeMode="contain"
                            />
                        )}
                      </>
                  ) : (
                      <Text style={styles.LoadingText}>Feature not available.</Text>
                  )}
                </View>
              </View>
            </View>
          </View>
          {/* Navigation buttons to go to the next/previous feature */}
          <View style={styles.NavigationButtons}>
            <TouchableOpacity onPress={handlePreviousFeature}>
              <Text style={styles.NavButtonText}>Previous</Text>
            </TouchableOpacity>
            <Text> {currentFeature+1}/15</Text>
            <TouchableOpacity onPress={handleNextFeature}>
              <Text style={styles.NavButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
  }


  if (page === 'explanationgraph') {
    return (
        <View style={styles.container_p}>
          <View style={styles.chartContainer_p}>
            {chartUrl ? (
                <Image
                    source={{ uri: `${API_URL}${chartUrl.five_factor}?${new Date().getTime()}` }}
                    style={styles.chartImage_p}
                    resizeMode="contain"
                />
            ) : (
                <Text style={styles.loadingText_p}>Loading chart...</Text>
            )}
          </View>
          <View style={styles.Group570}>
            <Text style={styles.subsubtitle}>
              Starting Point:
            </Text>
            <Text style={styles.Subtext}>
              The graph begins with the average score, representing
              the performance of a typical student.
            </Text>
            <Text style={styles.subsubtitle}>
              Predicted Score Calculation:
            </Text>
            <Text style={styles.Subtext}>
              Your predicted score is calculated by adding the impact of your
              personal characteristics and study habits to the average score.
            </Text>
            <Text style={styles.subsubtitle}>
              Positive and Negative Contributions:
            </Text>
            <Text style={styles.Subtext}>
              • Green arrows indicate positive
              contributions to your score.
            </Text>
            <Text style={styles.Subtext}>
              • Red arrows indicate negative
              contributions to your score.
            </Text>
            <Text style={styles.subsubtitle}>
              Arrow Size:
            </Text>
            <Text style={styles.Subtext}>
              The size of the arrows
              reflects the magnitude of each factor's impact on your score.
            </Text>
            <Text style={styles.subsubtitle}>
              Final Score:
            </Text>
            <Text style={styles.Subtext}>
              The combined adjustments (positive and negative) lead to your
              final predicted score.
            </Text>
          </View>
          <View style={styles.BackButtonContainer}>
            <TouchableOpacity onPress={() => setPage('prediction')}>
              <Text style={styles.ButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
    )
  }

  return null;
};

export default App;