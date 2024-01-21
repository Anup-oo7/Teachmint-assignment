
import { BrowserRouter, Routes, Route} from 'react-router-dom';

import Directory from './components/directory/Directory'
import UserPosts from './components/userposts/UserPosts'
import './App.css';

function App() {
  return (
    <BrowserRouter className="App">
      <Routes>
        <Route path="/" element={<Directory />} />
        <Route path="/:id" element={<UserPosts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
