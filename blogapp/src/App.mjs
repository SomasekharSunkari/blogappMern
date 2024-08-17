import './App.css';
import Header from './Components/Header/Header.mjs';
import Login from './Components/Login/Login.mjs';
import { Routes,Route } from 'react-router-dom';
import Register from './Components/Register/Register.mjs';
import { UserContextProvider } from './Components/Context/UserContext.mjs';
import CreatePosts from './Components/CreatePosts/CreatePosts.mjs';
import Home from './Components/Home/Home.mjs';
import Postpage from './Components/Postpage/Postpage.mjs';
import EditPost from './Components/editpost/EditPost.mjs';

function App() {
  return (
    <div className="App">
      <UserContextProvider>
            <Header/>

      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register'element={<Register/>} />
        <Route path='/create' element={<CreatePosts/>}/>
        <Route path='/posts/:id' element={<Postpage/>}/>
        <Route path='/edit/:id' element={<EditPost/>}/>
        <Route path='/' element={<Home/>}/>
      </Routes>
      </UserContextProvider>
    </div>
  );
}

export default App;
