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





/**
 * Groups rows from a list of maps by multiple column values.
 *
 * Example:
 * Input Rows:
 *   [{"A": 1, "B": 3, "C": "X"}, {"A": 1, "B": 3, "C": "Y"}, {"A": 2, "B": 5, "C": "Z"}]
 * Group By Columns:
 *   ["A", "B"]
 * Output:
 *   [{"A": 1, "B": 3, "C": ["X", "Y"]}, {"A": 2, "B": 5, "C": ["Z"]}]
 */


    private List<Map<String, Object>> groupRecordsByMultipleColumns(
        ExcelSheetJsonRecordGrouper grouper,
        List<String> groupByColumns
     ) {
    // Get all rows, where each row is a map of column name to value
    List<Map<String, Object>> rows = grouper.getJsonValues();
    if (rows == null || rows.isEmpty()) return Collections.emptyList();

    // Use LinkedHashMap to preserve insertion order of groups
    Map<List<Object>, Map<String, Object>> grouped = new LinkedHashMap<>();

    // Loop through each row to group by the specified columns
    for (Map<String, Object> row : rows) {

        // 🔑 Step 1: Create a composite key (List<Object>) from groupBy column values
        List<Object> groupKey = new ArrayList<>();
        for (String col : groupByColumns) {
            groupKey.add(row.getOrDefault(col, "")); // handle missing values as empty
        }

        // 🔁 Step 2: Get the group for the key, or create it if not exists
        Map<String, Object> group = grouped.computeIfAbsent(groupKey, k -> {
            Map<String, Object> newGroup = new LinkedHashMap<>();

            // Add groupBy columns as individual values (not list)
            for (int i = 0; i < groupByColumns.size(); i++) {
                newGroup.put(groupByColumns.get(i), groupKey.get(i));
            }

            // Initialize all non-grouped columns as empty lists
            for (String col : row.keySet()) {
                if (!groupByColumns.contains(col)) {
                    newGroup.put(col, new ArrayList<>()); // will collect grouped values
                }
            }

            return newGroup;
        });

        // ➕ Step 3: Add values to the non-grouped columns
        for (Map.Entry<String, Object> entry : row.entrySet()) {
            String col = entry.getKey();

            // Only add to non-grouped columns (groupBy columns are already stored flat)
            if (!groupByColumns.contains(col)) {
                @SuppressWarnings("unchecked")
                List<Object> list = (List<Object>) group.get(col);
                list.add(entry.getValue());
            }
        }
    }

    // Convert the grouped map values into a list of grouped result maps
    return new ArrayList<>(grouped.values());
}



