import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    // General
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    topContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: "rgba(255,255,255,1)",
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: "rgba(255,255,255,1)",
    },
    LeftButtonBG: {
        width: 0.35 * width,
        height: 0.05 * height,
        backgroundColor: "rgba(44,17,252,0.08)",
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 20,
        marginTop: '5%',
        marginBottom: '5%'
    },
    RightButtonBG: {
        width: 0.35 * width,
        height: 0.05 * height,
        backgroundColor: "rgba(44,17,252,0.08)",
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 20,
        marginTop: '5%',
        marginBottom: '5%'
    },
    HiddenButtonBG: {
        width: 0.35 * width,
        height: 0.05 * height,
        backgroundColor: "rgba(44,17,252,0)",
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 20,
        marginTop: '5%',
        marginBottom: '5%'
    },
    buttonBG: {
        width: 0.6 * width,
        height: 0.05 * height,
        backgroundColor: "rgba(44,17,252,0.08)",
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 20,
        marginTop: 0.05*height
    },
    ButtonText: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: 'rgba(0,0,0,1)',
        fontSize: 20,
        lineHeight: 20,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '400',
        textAlign: 'center',
        alignItems: 'center',
    },
    HiddenButtonText: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: 'rgba(0,0,0,0)',
        fontSize: 20,
        lineHeight: 20,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '400',
        textAlign: 'center',
        alignItems: 'center',
    },
    BoldText: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 10
    },
    Title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    SubTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    SmallText: {
        fontSize: 15,
        textAlign: 'center',
    },

    // Page home
    HomeTopContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 0.1 * width, // 10% of screen width
        paddingRight: 0.1 * width,
        paddingTop: 0.20 * height, // 20% of screen height
        paddingBottom: 0.3 * height,
    },
    HomeContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 0.1 * width, // 10% of screen width
        paddingRight: 0.1 * width,
        paddingTop: 0.1 * height, // 20% of screen height
        paddingBottom: 0.1 * height,
        height: 0.70 * height,
        backgroundColor: 'rgba(255,255,255,0.75)',
        borderRadius: 50
    },
    HomeMainTitle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: 'rgba(0,0,0,1)',
        fontSize: 34,
        lineHeight: 34,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 25,
    },
    HomeSubtitle: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: 'rgba(0,0,0,1)',
        fontSize: 18,
        lineHeight: 18,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '400',
        textAlign: 'center',
        marginBottom: 75,
    },
    HomeButtonContainer: {
        width: '100%',
        paddingLeft: 0.1 * width,
        paddingRight: 0.1 * width,
        paddingTop: 18,
        paddingBottom: 18,
        backgroundColor: 'rgba(44,17,252,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20
    },
    HomePredictionText: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: 'rgba(0,0,0,1)',
        fontSize: 28,
        lineHeight: 28,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '400',
        textAlign: 'center',
    },
    HomeLink: {
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 14,
        paddingBottom: 31,
        marginBottom: 0, // Ruimte tussen de knoppen
    },
    HomeHowDoesItWorkText: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        color: 'rgba(0,0,0,1)',
        fontSize: 20,
        lineHeight: 20,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '400',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },

    // Page tutorial
    MainContainer: {
        display:'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '5%',
        height: '95%',
        backgroundColor: 'rgba(255,255,255,0.75)',
        borderRadius: 50
    },
    Group998: {
        display: 'flex',
        flexDirection: 'column',
        width: '90%',
        paddingLeft: '10%',
        // boxSizing: 'border-box',

    },
    WhatDoesItDoThisAppl: {
        color: 'rgba(0,0,0,1)',
        fontSize: 16,
        lineHeight: 16,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '700',
        textAlign: 'left',
        paddingLeft: 0,
        marginBottom: 10,
        marginTop: 20,
    },
    ButtonContainer: {
        width: '100%',
        height: '10%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    FixedButtonContainer: {
        width: '100%',
        height: '10%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        position: 'absolute',
        top: '1%'
    },
    Subtext: {
        display: 'flex',
        flexDirection: 'column',
        color: 'rgba(0,0,0,1)',
        fontSize: 16,
        lineHeight: 16,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '400',
        textAlign: 'left',
        marginBottom: 5,
    },
    Subtext2: {
        display: 'flex',
        flexDirection: 'column',
        color: 'rgba(0,0,0,1)',
        fontSize: 16,
        lineHeight: 16,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '400',
        textAlign: 'left',
    },
    BulletSubtext: {
        display: 'flex',
        flexDirection: 'column',
        color: 'rgba(0,0,0,1)',
        fontSize: 16,
        lineHeight: 16,
        fontFamily: 'Inter, sans-serif',
        fontWeight: '400',
        textAlign: 'left',
        marginBottom: 5,
        marginLeft: 0.1 * width
    },


    // Page Course selection
    CSTableContainer: {
        width: "90%",
        height: "30%",
        borderWidth: 2,
        paddingLeft: '5%',
        paddingRight: '5%',
        borderColor: "rgba(0,0,0,0)",
        paddingBottom: '5%'
    },
    CSPlaceholderMessage: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginTop: 20,
    },
    CSBottomContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        width: '90%',
    },
    CSSelected: {
        width: '100%',
        height: 'auto',
        backgroundColor: "rgba(44,17,252,0.08)",
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderRadius: 20,
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1
    },
    Input_container: { 
        display: 'flex',
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingBottom: '10%'
     },
    sliderContainer: {
        marginVertical: 10,
        width: '100%'
    },
    sliderLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    sliderValue: {
        marginTop: 5,
        fontSize: 14,
        color: '#555',
        textAlign: 'center',
    },
    inputContainer: { marginBottom: '2%', alignContent: 'space-evenly', width: '100%' },
    container2: {
        flex: 1,
        backgroundColor: '#rgba(255,255,255,1)',
    },
    chartContainer: {
        width: '100%',
        height: '28%'
    },
    chartImage: {
        width: '100%',
        height: '100%',
    },
    loadingText2: {
        fontSize: 16,
        color: '#999999', // Subtle gray for loading text
    },
    centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
    label_cs: { fontSize: 36, fontWeight: '600', marginBottom: 5, textAlign: 'center' },
    label_sp: { fontSize: 20, fontWeight: '600', marginBottom: 5, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, height: 50, fontSize: 24, margin: '2%'},
    input_sp: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, height: 50, fontSize: 24 },
    loadingText: { fontSize: 18, marginTop: 10 },
    
    ForWhichCourseDoYouW: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "rgba(0,0,0,1)",
        fontSize: 32,
        lineHeight: 32,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        textAlign: "center",
        alignItems: "center",
        marginTop: 50,
        marginBottom: 10,
    },
    title_margin_top: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "rgba(0,0,0,1)",
        fontSize: 36,
        lineHeight: 36,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        textAlign: "center",
        alignItems: "center",
        top: 0.075 * height
    },
    ExpectedScore: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    center: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        margin: 16,
        alignItems: 'center',
        width: 0.8 * width
    },
    Explanation: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: 'space-evenly',
        height: 0.45 * height
    },
    subsubtitle: {
        color: "rgba(0,0,0,1)",
        fontSize: 16,
        lineHeight: 16,
        fontFamily: "Inter, sans-serif",
        fontWeight: "700",
        // marginTop: 200,
    },
    // Header
    header_p: {
        alignItems: 'center',
        margin: 0.05 * height,
    },
    title_p: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    ButtonRow: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        maxHeight: 0.1 * height,
    },
    // Chart container
    chartContainer_p: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    chartContainer_e: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    chartImage_p: {
        width: 0.95 * width,
        height: 'auto'
    },
    loadingText_p: {
        fontSize: 16,
        color: '#999999',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 8,
        color: '#555555',
    },

    // Factors section
    factorsContainer: {
        height: '25%'
    },
    factorText: {
        fontSize: 16,
        color: '#333333',
        marginBottom: '2%',
        marginLeft: 10,
        marginRight: 10,
    },

    // Link container
    linkContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    linkText: {
        fontSize: 16,
        color: '#6200ee',
        textDecorationLine: 'underline',
    },

    // Button container
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    VerticalButtonContainer: {
        width: '90%',
        height: '15%'
    },
    button: {
        backgroundColor: 'rgba(44,17,252,0.08)',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginBottom: 8,
    },
    button_p: {
        backgroundColor: 'rgba(44,17,252,0.08)',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginBottom: 8,
        height: 0.5 * height
    },
    buttonText: {
        color: 'rgba(0,0,0,1)',
        fontSize: 16,
        fontWeight: 'bold',
    },
    coursesListContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    courseItem: {
        padding: 10,
        backgroundColor: '#f0f0f0',
        marginVertical: 5,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    selectedCourse: {
        backgroundColor: "rgba(44,17,252,0.1)",
    },
    courseText: {
        fontSize: 16,
        color: '#333',
    },
    GEContainer: { flexDirection: 'column', margin: 10, height: "50%", alignItems: 'center' },
    chart_container_i: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        maxHeight: 0.5 * height,
        backgroundColor: "rgba(255,255,255,1)",
    },
    FeatureTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    ExplanationText: { fontSize: 14, marginVertical: 10, textAlign: 'left' },
    LoadingText: { fontSize: 14, fontStyle: 'italic', marginVertical: 10 },
    GraphImage: { width: 0.9 * width, aspectRatio: 10/6, marginVertical: 10 },
    NavigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width * 0.95,
        marginTop: 20,
        left: 0.025*width
    },
    FeatureName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default styles;