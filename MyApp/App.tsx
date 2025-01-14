import React, { useState, FC, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, ActivityIndicator, Alert, Image, TouchableOpacity, FlatList, ImageBackground } from 'react-native';
import axios from 'axios';
import CustomSlider from './CustomSlider';
import CustomDropDown from './CustomDropDown';
import styles from './styles';

// Version 234
const API_URL = 'http://3.21.207.75';

const App: FC = () => {
  const [page, setPage] = useState<string>('home'); // Dit aanpassen als jullie die als eerste pagina willen
  const [loadingMessage, setLoadingMessage] = useState<string>('Loading...');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentCourse, setCurrentCourse] = useState<string>('');
  const [studyPoints, setStudyPoints] = useState<string>();
  const [allCourses, setAllCourses] = useState<string[]>([]);
  let [l, setL] = useState(16);

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

  const mapping_prediction : { [key: string]: string } = {
    Hours_Studied: 'The amount you study',
    Attendance: 'Your attendance rate',
    Parental_Involvement: 'Your parental involvement',
    Sleep_Hours: 'The amount you sleep',
    Extracurricular_Activities: 'You partaking in extracurricular activities',
    Previous_Scores: 'Your past scoring',
    Motivation_Level: 'Your motivation level',
    Tutoring_Sessions: 'The amount of tutoring sessions you have',
    Family_Income: 'Your family income',
    Teacher_Quality: 'The quality of your teachers',
    Peer_Influence: "Your friend's influence",
    Physical_Activity: 'The amount of physical activity you do',
    Distance_from_Home: 'Your home to school distance',
    Gender: 'Your gender',
    Learning_Disabilities: 'Your learning disabilities',
    Study_Points: 'The amount of study points this course is',
  };

  const [featuresList, setFeatureList] = useState<string[]>([
    "Hours_Studied", "Attendance", "Parental_Involvement", "Sleep_Hours",
    "Extracurricular_Activities", "Previous_Scores", "Motivation_Level",
    "Tutoring_Sessions", "Family_Income", "Teacher_Quality", "Peer_Influence",
    "Physical_Activity", "Distance_from_Home", "Gender", "Learning_Disabilities"
  ]);

  // Define actionable features
  const actionableFeatures = new Set([
    "Hours_Studied", "Attendance", "Parental_Involvement", "Sleep_Hours",
    "Extracurricular_Activities", "Motivation_Level", "Tutoring_Sessions",
    "Physical_Activity", "Peer_Influence"
  ]);

  
  const handleFeatureList = (list: string[]) => {
    // Sort features into actionable and non-actionable while maintaining order
    const sortedFeatures = [
      ...list.filter(feature => actionableFeatures.has(feature)), // Actionable first
      ...list.filter(feature => !actionableFeatures.has(feature)) // Non-actionable next
    ];
  
    setFeatureList(sortedFeatures);
  };

  const [prediction, setPrediction] = useState<number | null>(null);
  const [chartUrl, setChartUrl] = useState<Record<string, any>>({
    five_factor: '',
    nineteen_factor: ''
  });

  const [plots, setPlots] = useState<Record<string, any>>({});
  const [explanation, setExplanation] = useState<Record<string, any>>();
  const [state, setState] = useState(true);

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
  const featureName = featuresList[currentFeature];

  const handleNextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % featuresList.length);
  };

  const handlePreviousFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + featuresList.length) % featuresList.length);
  };

  const handleInputChange = (key: string, value: string | number) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleStudyPointsChange = (value: string) => {
    setStudyPoints(value);
    handleInputChange("Study_Points", value);
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
      // Submitting prediction
      setLoadingMessage('Submitting data...');
      await axios.post(`${API_URL}/submit_input_prediction`, formData);

      // Waiting for loading of dataset
      setLoadingMessage('Loading dataset...');
      await axios.get(`${API_URL}/load-dataset`);

      // Requesting training of model
      setLoadingMessage('Training model...');
      await axios.post(`${API_URL}/train-model`, {});

      // Request prediction value
      setLoadingMessage('Getting prediction...');
      const response = await axios.get<{ prediction: number}>(`${API_URL}/get_prediction`);
      setPrediction(response.data.prediction);

      // Request explanations
      setLoadingMessage('Getting explanations...');
      const response_exp = await axios.get(`${API_URL}/get_explanation`);
      setExplanation(response_exp.data);
      setState(response_exp.data.state)

      if (state) {
        handleFeatureList(response_exp.data.explanation.features)
      }
      else {
        setFeatureList(response_exp.data.explanation.features)
      }

      setL(featuresList.length)

      // Request plots
      const responseURL = await axios.get(`${API_URL}/generate-plots`);

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
          { maxValue === 100 ?
            <>
              { minValue === 0 ?
                <Text style={styles.sliderValue}>
                  Value: {value === maxValue ? `${value}` : value === minValue ? `${value}` : value}
                </Text>
                :
                <Text style={styles.sliderValue}>
                  Value: {value === maxValue ? `${value}` : value === minValue ? `${value} or less` : value}
                </Text>
              }
            </>
            :
            <>
              { minValue === 0 ?
                <Text style={styles.sliderValue}>
                  Value: {value === maxValue ? `${value} or more` : value === minValue ? `${value}` : value}
                </Text>
                :
                <Text style={styles.sliderValue}>
                  Value: {value === maxValue ? `${value} or more` : value === minValue ? `${value} or less` : value}
                </Text>
              }
            </>
          }
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
      <ImageBackground
        source={require('./images/background.jpg')} // Reference your local image
        style={styles.background}
      >
        <View style={styles.MainContainer}>
        <View style={styles.ButtonContainer}>
            <TouchableOpacity style={styles.LeftButtonBG} onPress={() => setPage('home')}>
              <Text style={styles.ButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.HiddenButtonBG}>
              <Text style={styles.HiddenButtonText}>Back to main screen</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.Title}>
            How does our application work?
          </Text>
          
          <ScrollView>
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
      </ImageBackground>
    );
  }

  if (page === 'ChooseCourse') {
    return (      
      <ImageBackground
      source={require('./images/background.jpg')} // Reference your local image
      style={styles.background}
      >
        <View style={styles.MainContainer}>
          <View style={styles.ButtonContainer}>
            <TouchableOpacity style={styles.LeftButtonBG} onPress={() => setPage('home')}>
              <Text style={styles.ButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.HiddenButtonBG}>
              <Text style={styles.HiddenButtonText}>Back to main screen</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.Title}>For which course do you want to make a prediction?</Text>
            <TextInput
                style={styles.input}
                placeholder={'Enter your course here'}
                value={currentCourse || ''}  // Use currentCourse as the value
                onChangeText={(value) => setCurrentCourse(value)}  // Update the currentCourse state
            />
          </View> 

          <View style={styles.inputContainer}>
            <Text style={styles.SubTitle}>{"Study points"}</Text>
            <TextInput
                style={styles.input}
                placeholder={"e.g. 6"}
                value={studyPoints}
                keyboardType={'default'}
                onChangeText={(value) => handleStudyPointsChange(value)}
            />
          </View>
          <Text style={styles.SubTitle}>
            Overview of previous predictions
          </Text>
          <Text style={styles.SmallText}>
            (Pick one to load the inputs)
          </Text>
          <View style={styles.CSTableContainer}>
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
          <View style={styles.CSBottomContainer}>
            <View style={styles.CSSelected}>
              <Text style={styles.BoldText}>You selected: {currentCourse}</Text>
            </View>
            <View style={styles.ButtonContainer}>
              <TouchableOpacity style={styles.LeftButtonBG} onPress={() => setPage('home')}>
                <Text style={styles.ButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCourseSelection} style={styles.RightButtonBG}>
                <Text style={styles.ButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
    </ImageBackground>
    )
  }

  if (page === 'input') {
    return (
      <ImageBackground
      source={require('./images/background.jpg')} // Reference your local image
      style={styles.background}
      >
        <View style={styles.MainContainer}>
          <View style={styles.ButtonContainer}>
            <TouchableOpacity style={styles.LeftButtonBG} onPress={() => setPage('ChooseCourse')}>
              <Text style={styles.ButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.HiddenButtonBG}>
              <Text style={styles.HiddenButtonText}>Back to main screen</Text>
            </TouchableOpacity>
          </View>
            
          <ScrollView contentContainerStyle={styles.Input_container}>
            <Text style={styles.Title}>Please provide following details for the selected course</Text>
            {renderSlider(
                'How many hours do you study per week (excluding classes) for this course?',
                formData['Hours_Studied'],
                'Hours_Studied',
                1,
                44,
                1
            )}
            {renderSlider(
                'What is your attendance rate for this course (%)?',
                formData['Attendance'],
                'Attendance',
                60,
                100,
                1
            )}
            {renderSlider(
                'Previous Year Score',
                formData['Previous_Scores'],
                'Previous_Scores',
                50,
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
                4,
                10,
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
                8,
                1
            )}
            {renderDropdown(
                'What is the level of your family income?',
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
                6,
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

            <View style={styles.ButtonContainer}>
              <TouchableOpacity style={styles.LeftButtonBG} onPress={() => setPage('ChooseCourse')}>
                <Text style={styles.ButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.RightButtonBG} onPress={handlePredict}>
                <Text style={styles.ButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    );
  }
  
  if (page === 'prediction') {
    return (
      <ImageBackground
      source={require('./images/background.jpg')} // Reference your local image
      style={styles.background}
      >
        <View style={styles.MainContainer}>
          <View style={styles.ButtonContainer}>
            <TouchableOpacity style={styles.LeftButtonBG} onPress={() => setPage('input')}>
              <Text style={styles.ButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCleaning} style={styles.RightButtonBG}>
              <Text style={styles.ButtonText}>Main screen</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.Title}>Expected score: {prediction}%</Text>

            {state ? (
              <>
                {/* Chart Section */}
                <View style={styles.chartContainer}>
                  {chartUrl ? (
                    <Image
                      source={{ uri: `${API_URL}${chartUrl.five_factor}?${new Date().getTime()}` }}
                      style={styles.chartImage}
                      resizeMode="contain" // Ensures the image scales proportionally
                    />
                  ) : (
                    <Text style={styles.loadingText2}>Loading chart...</Text> // Fallback message
                  )}
                </View>

                {/* Link */}
                <TouchableOpacity style={styles.linkContainer} onPress={() => setPage('explanationgraph')}>
                  <Text style={styles.linkText}>
                    Learn more about how this graph works
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}

            {/* Factors Impact Section */}
            <ScrollView style={styles.factorsContainer}>
              {explanation && (explanation.state ? 
                                ['the highest', 'the second highest', 'the third highest', 'the fourth highest', 'the fifth highest'] 
                                : 
                                Array(l).fill("some")
                              ).map((rank, index) => {
                // Safely access values and features with proper fallback
                const value = explanation.explanation.values[index]
                const feature = explanation.explanation.features[index]
                const mappedFeature = mapping_prediction[feature as keyof typeof mapping_prediction] ?? feature;


                // Initialize score and impact
                let score = '0';
                let impact = 'N/A';

                if (typeof value === 'number') {
                  score = Math.abs(value).toFixed(2) // Absolute value for percentage
                  impact = value > 0 ? 'increases' : 'decreases'
                }

                if (state) {
                  return (
                    <Text key={index} style={styles.factorText}>
                      • {mappedFeature} has {rank} impact: it {impact} the predicted score by {score} percent.
                    </Text>
                  );
                } else {
                  return (
                    <Text key={index} style={styles.factorText}>
                      • {mappedFeature} has {rank} impact: it {impact} the predicted score.
                    </Text>
                  );
                }
              })}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.VerticalButtonContainer}>
              <TouchableOpacity onPress={() => {setPage('improvements')}} style={styles.button}>
                <Text style={styles.buttonText}>How to improve my result?</Text>
              </TouchableOpacity>
              {state ? (
                <>
                  <TouchableOpacity onPress={() => setPage('DetailedGraph')} style={styles.button}>
                    <Text style={styles.buttonText}>See full graph with all factors</Text>
                  </TouchableOpacity>
                </>
              ) : null }
            </View>
          </View>
      </ImageBackground>
    );
  }

  if (page === 'DetailedGraph') {
    return (
      <ImageBackground
      source={require('./images/background.jpg')} // Reference your local image
      style={styles.background}
      >
        <View style={styles.MainContainer}>

          <View style={styles.FixedButtonContainer}>
            <TouchableOpacity style={styles.LeftButtonBG} onPress={() => setPage('prediction')}>
              <Text style={styles.ButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.HiddenButtonBG}>
              <Text style={styles.HiddenButtonText}>Main screen</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.Title}>Expected score: {prediction}%</Text>

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
      </ImageBackground>
    );
  };

  if (page === 'improvements') {
    return (
      <ImageBackground
      source={require('./images/background.jpg')} // Reference your local image
      style={styles.background}
      >
        <View style={styles.MainContainer}>

          <View style={styles.ButtonContainer}>
            <TouchableOpacity style={styles.LeftButtonBG} onPress={() => setPage('prediction')}>
              <Text style={styles.ButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.HiddenButtonBG}>
              <Text style={styles.HiddenButtonText}>Main screen</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.center}>
            <Text style={styles.ExpectedScore}>Expected score: {prediction}%</Text>
          </View>
          
          {/* Scrollable feature analysis section */}
          <View style={styles.GEContainer}>
                  <Text style={styles.FeatureTitle}>Feature Impact Analysis of: <Text style={styles.FeatureName}>{featureName}</Text></Text>

                  {/* Check if the current feature exists in the plots */}
                  <Text style={styles.ExplanationText}>{plots[featureName].explanation}</Text>
                  {state ? (
                    <>
                      {plots[featureName] ? (
                          <>
                            {/* Container for graph and text */}
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
                    </>
                  ) : null}
          </View>

          
          {/* Navigation buttons to go to the next/previous feature */}
          <View style={styles.ButtonContainer}>
            <TouchableOpacity style={styles.LeftButtonBG} onPress={handlePreviousFeature}>
              <Text style={styles.ButtonText}>Previous</Text>
            </TouchableOpacity>
            <Text> {currentFeature+1}/{l}</Text>
            <TouchableOpacity style={styles.LeftButtonBG} onPress={handleNextFeature}>
              <Text style={styles.ButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }

  if (page === 'explanationgraph') {
    return (
      <ImageBackground
      source={require('./images/background.jpg')} // Reference your local image
      style={styles.background}
      >
        <View style={styles.MainContainer}>

          <View style={styles.ButtonContainer}>
            <TouchableOpacity style={styles.LeftButtonBG} onPress={() => setPage('prediction')}>
              <Text style={styles.ButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.HiddenButtonBG}>
              <Text style={styles.HiddenButtonText}>Main screen</Text>
            </TouchableOpacity>
          </View>

          {state ? (
              <>
                {/* Chart Section */}
                <View style={styles.chartContainer}>
                  {chartUrl ? (
                    <Image
                      source={{ uri: `${API_URL}${chartUrl.five_factor}?${new Date().getTime()}` }}
                      style={styles.chartImage}
                      resizeMode="contain" // Ensures the image scales proportionally
                    />
                  ) : (
                    <Text style={styles.loadingText2}>Loading chart...</Text> // Fallback message
                  )}
                </View>
              </>
            ) : null}

          <View style={styles.Explanation}>
            <Text style={styles.subsubtitle}>
              Starting Point (left blue bar):
            </Text>
            <Text style={styles.Subtext}>
              The graph begins with the average score, representing
              the performance of a typical student.
            </Text>
            <Text style={styles.subsubtitle}>
              Predicted Score Calculation:
            </Text>
            <Text style={styles.Subtext2}>
              Your predicted score is calculated by adding the impact of your
              personal characteristics and study habits to the average score. This happens by making use of positive and negative contributions.
            </Text>
            <Text style={styles.BulletSubtext}>
              • Green bars indicate a positive
              contributions to your score.
            </Text>
            <Text style={styles.BulletSubtext}>
              • Red bars indicate a negative
              contributions to your score.
            </Text>
            <Text style={styles.subsubtitle}>
              Bar Size:
            </Text>
            <Text style={styles.Subtext}>
              The size of the bars
              reflects the magnitude of each factor's impact on your score.
            </Text>
            <Text style={styles.subsubtitle}>
              Final Score (right blue bar):
            </Text>
            <Text style={styles.Subtext}>
              The combined adjustments (positive and negative) lead to your
              final predicted score.
            </Text>
          </View>
        </View>
      </ImageBackground>
    )
  }

  return null;
};

export default App;
