import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import CategoryPage from "./pages/CategoryPage";

import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { useUserStore } from "./stores/useUserStore";
import { useEffect } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import CartPage from "./pages/CartPage";
import { useCartStore } from "./stores/useCartStore";
import PurchaseSuccessPage from "./pages/PurchaseSuccessPage";
import PurchaseCancelPage from "./pages/PurchaseCancelPage";

function App() {
	const { user, checkAuth, checkingAuth } = useUserStore();
	const { getCartItems } = useCartStore();
	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	useEffect(() => {
		if (!user) return;

		getCartItems();
	}, [getCartItems, user]);

	if (checkingAuth) return <LoadingSpinner />;

	return (
		<div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
			{/* Background gradient */}
			<div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
				</div>
			</div>

			<div className='relative z-50 pt-20'>
				<Navbar />
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/signup' element={!user ? <SignUpPage /> : <Navigate to='/' />} />
					<Route path='/login' element={!user ? <LoginPage /> : <Navigate to='/' />} />
					<Route
						path='/secret-dashboard'
						element={user?.role === "admin" ? <AdminPage /> : <Navigate to='/login' />}
					/>
					<Route path='/category/:category' element={<CategoryPage />} />
					<Route path='/cart' element={user ? <CartPage /> : <Navigate to='/login' />} />
					<Route
						path='/purchase-success'
						element={user ? <PurchaseSuccessPage /> : <Navigate to='/login' />}
					/>
					<Route path='/purchase-cancel' element={user ? <PurchaseCancelPage /> : <Navigate to='/login' />} />
				</Routes>
			</div>
			<Toaster />
		</div>
	);
}

export default App;










// import React from 'react';
// import DataTable from './DataTable';

// const App = () => {
//   // Sample data
//   const data = [
//     { id: 1, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
// 	{ id: 3, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 4, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
// 	{ id: 5, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 6, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
// 	{ id: 7, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 8, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
// 	{ id: 9, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 10, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
// 	{ id: 11, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 12, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
// 	{ id: 13, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 14, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
// 	{ id: 15, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 16, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
// 	{ id: 17, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 18, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
// 	{ id: 19, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 20, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
// 	{ id: 21, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 22, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
// 	{ id: 23, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 24, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
// 	{ id: 25, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 26, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
// 	{ id: 27, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 28, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
// 	{ id: 29, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 30, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
// 	{ id: 31, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 32, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
// 	{ id: 33, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 34, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
// 	{ id: 35, name: 'John Doe', email: 'john@example.com', age: 28, status: 'Active' },
//     { id: 36, name: 'Jane Smith', email: 'jane@example.com', age: 32, status: 'Inactive' },
//     // ... more data
//   ];

//   // Column configuration
//   const columns = [
//     { key: 'id', title: 'ID' },
//     { key: 'name', title: 'Name' },
//     { key: 'email', title: 'Email' },
//     { key: 'age', title: 'Age' },
//     { 
//       key: 'status', 
//       title: 'Status',
//       render: (value) => (
//         <span style={{ color: value === 'Active' ? 'green' : 'red' }}>
//           {value}
//         </span>
//       )
//     }
//   ];

//   return (
//     <div className="app">
//       <h1>User Management</h1>
//       <DataTable 
//         data={data} 
//         columns={columns} 
//         pageSizeOptions={[5, 10, 20]}
//         defaultPageSize={5}
//       />
//     </div>
//   );
// };

// export default App;







// import DataTable from './DataTable';

// const App = () => {
//   const data = [...Array(10000)].map((_, i) => ({
//     id: i + 1,
//     name: `Item ${i + 1}`,
//     category: i % 2 === 0 ? 'A' : 'B',
//   }));

//   const columns = [
//     { key: 'id', label: 'ID' },
//     { key: 'name', label: 'Name' },
//     { key: 'category', label: 'Category' },
//   ];

//   return (
//     <div className="p-4">
//       <DataTable data={data} columns={columns} filterKey="name" />
//     </div>
//   );
// };
// export default App;