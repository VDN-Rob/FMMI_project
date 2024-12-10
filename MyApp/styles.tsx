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
        alignItems: 'flex-start'
    },
    ButtonBG: {
        width: 0.3 * width,
        height: 0.05 * height,
        backgroundColor: "rgba(44,17,252,0.08)",
        alignItems: "center",
        justifyContent: 'center',
        margin: 10,
        borderRadius: 20
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
    BoldText: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 10
    },
    continueText: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "rgba(0,0,0,1)",
        fontSize: 20,
        lineHeight: 20,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        textAlign: "center",
    },
    SmallTitle: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        textAlign: 'center', 
        paddingTop: 20
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
    TutorialContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
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
    BackButtonContainer: {
        width: 100,
        height: 41,
        position: 'absolute', // Hiermee zet je het element uit de normale flow
        top: 0.05 * height, // Plaatst de knop aan de bovenkant
        left: 0,
        backgroundColor: 'rgba(44,17,252,0.08)',
        alignItems: 'center',
        justifyContent: 'center',
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
    CSContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        height: '100%',
        backgroundColor: "rgba(255,255,255,1)",
        maxHeight: 0.65 * height
    },
    CSTableContainer: {
        width: "90%",
        height: "40%",
        paddingLeft: 25,
        paddingRight: 40,
        paddingBottom: 50,
        borderWidth: 2,
        borderColor: "rgba(0,0,0,0)",
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
        width: '100%',
    },
    CSSelected: {
        width: 0.9 * width,
        height: 0.075 * height,
        backgroundColor: "rgba(44,17,252,0.08)",
        alignItems: 'flex-start',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 20,
        borderColor: "rgba(0,0,0,1)",
        borderWidth: 1
    },

    // Page input
    Input_container: { flexGrow: 1, padding: 20, paddingBottom: 100 },
    sliderContainer: {
        marginVertical: 10,
        padding: 10,
        borderRadius: 5,
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
    container2: {
        flex: 1,
        backgroundColor: '#rgba(255,255,255,1)', // Background color for the page
        padding: 16, // Padding around the content
    },

    // Header container
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },

    // Back button
    backButton: {
        marginRight: 10, // Space between button and title
    },
    backText: {
        color: '#6200ee', // Accent color
        fontSize: 16,
    },

    // Page title
    title2: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1, // Ensures title takes up remaining space
        textAlign: 'center',
    },

    // Chart container
    chartContainer: {
        flex: 1, // Takes up remaining space
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // Prevents content spilling out of rounded edges
    },

    // Chart image
    chartImage: {
        width: width,
        height: '100%',
    },

    // Loading text
    loadingText2: {
        fontSize: 16,
        color: '#999999', // Subtle gray for loading text
    },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
    label_cs: { fontSize: 36, fontWeight: '600', marginBottom: 5, textAlign: 'center' },
    label_sp: { fontSize: 20, fontWeight: '600', marginBottom: 5, textAlign: 'center' },
    inputContainer: { marginBottom: 15 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, height: 60, fontSize: 24 },
    input_sp: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, height: 50, fontSize: 24 },
    loadingText: { fontSize: 18, marginTop: 10 },
    prediction: { fontSize: 32, fontWeight: 'bold', marginVertical: 20 },
    text2: {
        fontSize: 18,         // Matches label and other text sizes for consistency
        marginVertical: 5,    // Similar to text's spacing for uniformity
        color: '#333',        // A neutral text color to stand out against a likely light background
        textAlign: 'center',  // Aligns well with a centered layout
        lineHeight: 24,       // Provides comfortable readability with a consistent ratio
        fontWeight: '400',    // Keeps the text weight balanced and not too bold
    },
    
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
        marginTop: 100,
        marginBottom: 10,
    },
    Group381: {
        width: "70%",
        height: 45,
        paddingLeft: 10,
        paddingRight: 18,
        paddingBottom: 9,
        borderWidth: 2,
        borderColor: "rgba(0,0,0,1)",
        backgroundColor: "rgba(255,255,255,1)",
        marginBottom: 85,
    },
    HierMoetDeStudentZij: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "rgba(249,9,9,1)",
        fontSize: 14,
        lineHeight: 14,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        textAlign: "center",
    },
    OverviewOfPreviousPr: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "rgba(0,0,0,1)",
        fontSize: 20,
        lineHeight: 20,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        textAlign: "center",
        marginBottom: 25,
    },
    HierMoetDeOverviewVa: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "rgba(255,1,1,1)",
        fontSize: 14,
        lineHeight: 14,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        textAlign: "center",
        paddingLeft: 25,
        // paddingRight:25,
    },
    Iphone13143: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        width: '100%',
        height: '100%',
        backgroundColor: "rgba(255,255,255,1)",
    },
    Group2910: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: '90%',
        justifyContent: "center",
        textAlign: "center",
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
        marginTop: 110,
        alignItems: "center",
    },
    Group356: {
        width: "100%",
        height: 268,
        paddingTop: 97,
        paddingBottom: 121,
        borderWidth: 2,
        borderColor: "rgba(0,0,0,1)",
        backgroundColor: "rgba(255,255,255,1)",
        marginBottom: 15,
    },
    HierMoetDeGrafiekKom: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "rgba(255,18,18,1)",
        fontSize: 14,
        lineHeight: 14,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        textAlign: "center",
    },
    ThisGraphShowsThe5Fa: {
        color: "rgba(0,0,0,1)",
        fontSize: 16,
        lineHeight: 16,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
    },
    Group19: {
        width: "100%",
        height: 25,
    },
    Group181: {
        position: "relative",
        width: "100%",
        height: "100%",
    },
    Group17: {
        position: "absolute",
        left: 13.09,
        width: 358.91,
        height: "100%",
        // paddingRight: 18.91,
        // paddingBottom: 9,
    },
    LearnHereMoreAboutHo: {
        color: "rgba(0,0,0,1)",
        fontSize: 16,
        lineHeight: 16,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        textDecorationLine: "underline",
    },
    Group25: {
        display: "flex",
        flexDirection: "column", // Zorgt ervoor dat de tekst verticaal gestapeld wordt
        alignItems: "flex-start", // Zorgt ervoor dat de tekst naar links wordt uitgelijnd
        justifyContent: "flex-start", // Zorgt ervoor dat de tekst niet in het midden staat
        width: '90%',
        textAlign: "left",
        marginBottom: 20,
    },
    FactorMetHoogsteImpa: {
        color: "rgba(0,0,0,1)",
        fontSize: 16,
        lineHeight: 16,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        textAlign: "left",
        padding: 0,
        margin: 0,
        alignItems: "flex-start",
        marginBottom: 5,
    },
    Group13: {
        width: "80%",
        height: 51,
        paddingBottom: 8,
        marginBottom: 10,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "rgba(217,217,217,1)",
    },
    HowToImproveMyResult: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "rgba(0,0,0,1)",
        fontSize: 23,
        lineHeight: 23,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        textAlign: "center",
    },
    Group12: {
        width: "80%",
        height: 51,
        paddingBottom: 8,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        backgroundColor: "rgba(217,217,217,1)",
    },
    SeeFullGraphWithAllF: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "rgba(0,0,0,1)",
        fontSize: 23,
        lineHeight: 23,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        textAlign: "center",
        alignItems: "center",
    },
    Iphone13144: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        textAlign: "center",
        width: '100%',
        height: '100%',
        // paddingRight: 18,
        paddingBottom: 74,
        backgroundColor: "rgba(255,255,255,1)",
    },
    Group182: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
    },// Container for the chart image
    Group947: {
        flex: 1,                    // Ensures the container takes available space
        width: '100%',
        height:300,              // Makes it as wide as its parent container
        justifyContent: 'center',   // Centers the image vertically
        alignItems: 'center',       // Centers the image horizontally
        backgroundColor: '#f9f9f9',
    },
    HierKomtDeGedetaille: {
        color: "rgba(253,25,25,1)",
        fontSize: 16,
        lineHeight: 16,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
    },
    Iphone13145: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: 1000,
        height: 500,
        backgroundColor: "rgba(255,255,255,1)",
        marginLeft: 15,
    },
    Group471: {
        position: "absolute",
        top: 100,
        display: "flex",
        flexDirection: "row",
        width: 200,
        height: 700,
    },
    Group23: {
        width: 350,
        height: "100%",
        paddingBottom: 0.42,
        marginRight: 40,
        // marginBottom:20,
    },
    Group20: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        // paddingLeft: 16,
        // paddingRight: 18.72,
        // paddingTop: 35,
        // paddingBottom: 84.42,
        marginBottom:20,
    },
    FactorMetHoogsteImpact: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "rgba(255,30,30,1)",
        fontSize: 24,
        lineHeight: 24,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        textAlign: "center",
        marginBottom: 25,
    },
    HierKomtDeSliderKeuz: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "rgba(255,18,18,1)",
        fontSize: 24,
        lineHeight: 24,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        textAlign: "center",
        marginBottom: 45,
    },
    FactorImpactOnPredic: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "rgba(0,0,0,1)",
        fontSize: 16,
        lineHeight: 16,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        textAlign: "center",
    },
    Group038: {
        width: "100%",
        height: 190.21,
        paddingLeft: 25,
        paddingRight: 16.73,
        paddingTop: 66,
        paddingBottom: 92.21,
        borderWidth: 2,
        borderColor: "rgba(0,0,0,1)",
        backgroundColor: "rgba(255,255,255,1)",
        marginBottom: 25,
    },
    HierMoetDeUitlegKome: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "rgba(248,22,22,1)",
        fontSize: 20,
        lineHeight: 20,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        textAlign: "center",
    },
    ExpectedScore: {
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
        marginTop: 125,
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    Iphone13146: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        textAlign: "center",
        width: '100%',
        height: '100%',
        backgroundColor: "rgba(255,255,255,1)",
    },
    Group569: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 100,
        width: '80%',
    },
    GraphExplanation: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "rgba(0,0,0,1)",
        fontSize: 36,
        lineHeight: 36,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        textAlign: "center",
        marginBottom: 50,
    },
    HierMoetDeGrafiekNog: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "rgba(255,15,15,1)",
        fontSize: 20,
        lineHeight: 20,
        fontFamily: "Inter, sans-serif",
        fontWeight: "400",
        textAlign: "center",
        // marginBottom: 150,
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
    container_p: {
        flex: 1,
        backgroundColor: '#rgba(255,255,255,1)',
        padding: 10,
        justifyContent: 'space-between',
    },
    // Header
    header_p: {
        alignItems: 'center',
        marginBottom: 16,
    },
    title_p: {
        fontSize: 24, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        textAlign: 'center', 
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
        marginBottom: 16,
    },
    factorText: {
        fontSize: 16,
        color: '#333333',
        marginBottom: 4,
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
    button: {
        backgroundColor: 'rgba(44,17,252,0.08)',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        marginBottom: 8,
    },
    buttonText: {
        color: 'rgba(0,0,0,1)',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Back button
    backButtonContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    backButtonText: {
        fontSize: 16,
        color: '#6200ee',
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
        backgroundColor: '#007BFF', // Highlight color
    },
    courseText: {
        fontSize: 16,
        color: '#333',
    },
    selectedCourseText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007BFF',
        marginTop: 10,
    },
    container_i: { flex: 1, backgroundColor: '#fff', padding: 20 },
    ExpectedScore_i: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    BackButtonContainer_i: { marginBottom: 20 },
    Back_i: { color: '#007BFF', fontSize: 16 },
    scrollView_i: { marginTop: 20 },
    Iphone13145_i: { flexDirection: 'row' },
    Group471_i: { margin: 10 },
    Group23_i: { padding: 10 },
    Group20_i: { alignItems: 'center' },
    FeatureTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    ExplanationText: { fontSize: 14, marginVertical: 10, textAlign: 'center' },
    LoadingText: { fontSize: 14, fontStyle: 'italic', marginVertical: 10 },
    GraphImage: { width: 0.9 * width, aspectRatio: 10/6, marginVertical: 10 },
    FetchButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    // ButtonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
    // FeatureEffectContainer: {
    //     width: width * 0.85,
    //     padding: 10,
    //     borderWidth: 1,
    //     borderColor: '#ccc',
    //     borderRadius: 10,
    //     alignItems: 'center',
    //     backgroundColor: '#f9f9f9',
    // },
    NavigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width * 0.95,
        marginTop: 20,
    },
    NavButtonText: {
        fontSize: 16,
        color: '#007BFF',
    },
    FeatureName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default styles;