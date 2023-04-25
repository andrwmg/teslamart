<h2>How I worked on this project</h2>
<ul>
<li>Front-end: React, MUI and CSS: <a href='https://www.andrewmichaelgay.com/sw/portfolio/teslamartv2'>Screenshots</a></li>
<li>Back-end: Node, Express, and MongoDB</li>
<li>Worked in structure that simulated work environment with broken-down tasks, deadlines, and refactoring</li>
</ul>

<h2>Why I built the project this way</h2>
<ul>
<li>The original Tesla Mart used bootstrap, so I wanted to use MUI for a new challenge (and better-looking components. I found this to be much more organized and legible rather than relying on classes.</li>
<li>I used MongoDB because I already had experience in it from my first bootcamp, and had already build a database for the first version of Tesla Mart that I could reuse.</li>
<li>The app is broken down into components to keep code short and focused. I tried not to have too many shell components unless they were required. Initially, I created very similar components for each filter select, but refactored to use one select component with each filter's respective state passed down through props.</li>
</ul>

<h2>If I had more time I would change this</h2>
<ul>
<li>Refactor to use styled components instead of inline styles</li>
<li>Auto-scroll conversations to bottom on show and message send</li>
<li>Multiple selections on filters (e.g. two models, three years, etc.)</li>
<li>Add listing status (e.g. new, pending, sold)</li>
<li>Add comment replies instead of just a master list on each listing</li>
<li>Add "My Listings" and "Favorites" pages and links in user menu</li>
</ul>

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:8080](http://localhost:8080) to view it in your browser.

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
