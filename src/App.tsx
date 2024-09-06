import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Students from './pages/Students';
import Error404 from './pages/Error404';
import AppSidebar from './components/AppSidebar';

const App = () => {
	return (
		<Router>
			<div style={{ display: 'flex', height: '100vh' }}>
				<AppSidebar />
				<div style={{ flexGrow: 1, padding: '20px' }}>
					<Routes>
						<Route
							path='/'
							element={<Error404 />}
						/>
						<Route
							path='/tables'
							element={<Error404 />}
						/>
						<Route
							path='/analytics'
							element={<Error404 />}
						/>
						<Route
							path='/students'
							element={<Students />}
						/>
						<Route
							path='*'
							element={<Error404 />}
						/>
					</Routes>
				</div>
			</div>
		</Router>
	);
};

export default App;
