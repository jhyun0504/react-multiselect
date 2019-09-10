import React from 'react';
import './App.css';
import Multiselect from './components/Multiselect/multiselect';

function App() {
  return (
    <div className="App">
      <Multiselect
        elements={[
          { value: "chocolate", label: "Chocolate Cake" },
          { value: "strawberry", label: "Strawberry Cake" },
          { value: "vanila", label: "Vanila Cake" },
          { value: "Banana", label: "Banana Cake" }
        ]}
        onChange={(newValues) => {console.log(newValues)}}
        allowMultiselect
      />
    </div>
  );
}

export default App;