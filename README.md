# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

          @Transactional
            public void saveAllMeasures(List<Map<String, Object>> measuresJsonList) {
            for (Map<String, Object> measureJson : measuresJsonList) {
            // 1. Create Measure record
            ProfessionalQualityRefTableMeasure measure = new ProfessionalQualityRefTableMeasure();
            measure.setName((String) measureJson.get("name"));
            measure.setMeasureType((String) measureJson.get("measureType"));
            measure.setWeight(toBigDecimal(measureJson.get("weight")));
            measure.setMinimumThreshold(toBigDecimal(measureJson.get("minimumThreshold")));
            measure.setThresholdCount(0);
            measure.setOrder(0); // Optional, update as needed

        // Save Measure first
        measure.save(flush: true, failOnError: true);

        // 2. Create and save each threshold
        List<Map<String, Object>> thresholds = (List<Map<String, Object>>) measureJson.get("thresholds");
        int thresholdIndex = 0;
        for (Map<String, Object> thresholdJson : thresholds) {
            ProfessionalQualityRefTableMeasureThreshold threshold = new ProfessionalQualityRefTableMeasureThreshold();
            threshold.setPercentileRange((String) thresholdJson.get("percentileRange"));
            threshold.setMinScore(toBigDecimal(thresholdJson.get("minScore")));
            threshold.setMaxScore(toBigDecimal(thresholdJson.get("maxScore")));
            threshold.setPointLevel((Integer) thresholdJson.get("pointLevel"));
            threshold.setOrder(thresholdIndex++);
            threshold.setMeasure(measure); // Associate with parent

            threshold.save(flush: true, failOnError: true);
        }

        // 3. Update threshold count in parent
        measure.setThresholdCount(thresholds.size());
        measure.save(flush: true, failOnError: true);
    }
        }

          // Helper function
        private BigDecimal toBigDecimal(Object value) {
        if (value == null) return null;
        return new BigDecimal(value.toString());
        }
       

         yourService.saveAllMeasures(groupedData)
        
