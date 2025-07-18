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


    RowData.java
    
    import java.util.List;
    
    public class RowData {
    public int index;
    public List<Integer> values;
    public int total;

    public RowData(int index, List<Integer> values, int total) {
        this.index = index;
        this.values = values;
        this.total = total;
    }
}

    ExcelReader.java
    
    import com.aspose.cells.*;
    
    import java.io.File;
    import java.util.ArrayList;
    import java.util.List;
    
    public class ExcelReader {

    public List<RowData> read(File file) throws Exception {
        List<RowData> result = new ArrayList<>();
        Workbook workbook = new Workbook(file.getAbsolutePath());
        Worksheet sheet = workbook.getWorksheets().get(0);
        Cells cells = sheet.getCells();

        int rowIndex = 0;
        for (int r = 0; r <= cells.getMaxDataRow(); r++) {
            Row row = cells.getRow(r);
            int lastColIndex = row.getLastCellIndex();
            if (lastColIndex < 2) continue;

            List<Integer> values = new ArrayList<>();
            for (int c = 0; c < lastColIndex - 1; c++) {
                int val = getCellValue(cells.get(r, c));
                values.add(val);
            }

            int total = getCellValue(cells.get(r, lastColIndex - 1));
            result.add(new RowData(rowIndex++, values, total));
        }

        return result;
    }

    private int getCellValue(Cell cell) {
        if (cell == null) return 0;

        try {
            if (cell.getType() == CellValueType.IS_NUMERIC || cell.isFormula()) {
                return (int) cell.getDoubleValue(); // Aspose evaluates automatically
            }
        } catch (Exception ignored) {}
        return 0;
    }
}
DependencyResolver.java

    import java.util.*;
    
    public class DependencyResolver {

    private final List<RowData> rows;
    private final Map<Integer, List<Integer>> memo = new HashMap<>();

    public DependencyResolver(List<RowData> rows) {
        this.rows = rows;
    }

    public Map<Integer, List<Integer>> resolveAll() {
        Map<Integer, List<Integer>> result = new LinkedHashMap<>();
        for (int i = 0; i < rows.size(); i++) {
            Set<Integer> visited = new LinkedHashSet<>();
            dfs(i, visited);
            result.put(i, new ArrayList<>(visited));
        }
        return result;
    }

    private void dfs(int currentIndex, Set<Integer> visited) {
        if (memo.containsKey(currentIndex)) {
            visited.addAll(memo.get(currentIndex));
            return;
        }

        Set<Integer> localVisited = new LinkedHashSet<>();
        RowData current = rows.get(currentIndex);

        for (int i = 0; i < currentIndex; i++) {
            RowData candidate = rows.get(i);
            int sum = candidate.values.stream().mapToInt(Integer::intValue).sum();
            if (sum == current.total) {
                localVisited.add(i);
                dfs(i, localVisited);
            }
        }

        memo.put(currentIndex, new ArrayList<>(localVisited));
        visited.addAll(localVisited);
    }
}
✅ 4. Main.java

    import java.io.File;
    import java.util.List;
    import java.util.Map;
    
    public class Main {
    public static void main(String[] args) throws Exception {
    File file = new File("path/to/your/file.xlsx"); // <-- Update path

        ExcelReader reader = new ExcelReader();
        List<RowData> rows = reader.read(file);

        DependencyResolver resolver = new DependencyResolver(rows);
        Map<Integer, List<Integer>> dependencyMap = resolver.resolveAll();

        dependencyMap.forEach((rowIndex, deps) ->
                System.out.println("Row " + rowIndex + " -> " + deps));
    }
}
import com.aspose.cells.*;

        import java.io.File;
        import java.util.*;
        
        public class AsposeExcelDependencyAnalyzer {

    static class RowData {
        int index;
        List<Integer> values;
        int total;

        RowData(int index, List<Integer> values, int total) {
            this.index = index;
            this.values = values;
            this.total = total;
        }
    }

    public static void main(String[] args) throws Exception {
        File file = new File("path/to/your/file.xlsx"); // replace with actual path
        List<RowData> rows = readExcelWithAspose(file);

        Map<Integer, List<Integer>> dependencyMap = buildDependencyMap(rows);

        // ✅ Output result
        dependencyMap.forEach((rowIndex, deps) ->
                System.out.println("Row " + rowIndex + " -> " + deps));
    }

    // ✅ Read Excel and extract each row's values and total
    private static List<RowData> readExcelWithAspose(File file) throws Exception {
        List<RowData> result = new ArrayList<>();
        Workbook workbook = new Workbook(file.getAbsolutePath());
        Worksheet sheet = workbook.getWorksheets().get(0);
        Cells cells = sheet.getCells();

        int rowIndex = 0;

        for (int r = 0; r <= cells.getMaxDataRow(); r++) {
            Row row = cells.getRow(r);
            int lastColIndex = row.getLastCellIndex();
            if (lastColIndex < 2) continue;

            List<Integer> values = new ArrayList<>();
            for (int c = 0; c < lastColIndex - 1; c++) {
                int val = getCellValue(cells.get(r, c));
                values.add(val);
            }

            int total = getCellValue(cells.get(r, lastColIndex - 1));
            result.add(new RowData(rowIndex++, values, total));
        }

        return result;
    }

    // ✅ Safely extract evaluated numeric value
    private static int getCellValue(Cell cell) {
        if (cell == null) return 0;

        try {
            if (cell.getType() == CellValueType.IS_NUMERIC || cell.isFormula()) {
                return (int) cell.getDoubleValue(); // Aspose evaluates formulas automatically
            }
        } catch (Exception ignored) {}
        return 0;
    }

    // ✅ Optimized dependency resolver with memoization
    private static Map<Integer, List<Integer>> buildDependencyMap(List<RowData> rows) {
        Map<Integer, List<Integer>> result = new LinkedHashMap<>();
        Map<Integer, List<Integer>> memo = new HashMap<>();

        for (int i = 0; i < rows.size(); i++) {
            Set<Integer> visited = new LinkedHashSet<>();
            dfs(i, rows, visited, memo);
            result.put(i, new ArrayList<>(visited));
        }
        return result;
    }

    // ✅ DFS to resolve dependencies recursively
    private static void dfs(int currentIndex, List<RowData> rows,
                            Set<Integer> visited, Map<Integer, List<Integer>> memo) {
        if (memo.containsKey(currentIndex)) {
            visited.addAll(memo.get(currentIndex));
            return;
        }

        Set<Integer> localVisited = new LinkedHashSet<>();
        RowData currentRow = rows.get(currentIndex);

        for (int i = 0; i < currentIndex; i++) {
            RowData candidate = rows.get(i);
            int sum = candidate.values.stream().mapToInt(Integer::intValue).sum();

            if (sum == currentRow.total) {
                localVisited.add(i);
                dfs(i, rows, localVisited, memo); // resolve candidate's dependencies too
            }
        }

        memo.put(currentIndex, new ArrayList<>(localVisited));
        visited.addAll(localVisited);
    }
}
