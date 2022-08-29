//Counter.jsx
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function Counter(props) {
    let [count, setCount] = useState(10)

    function increment() {
        setCount(count + 1);
    }

    function decrement() {
        setCount(count - 1);
    }

    return(
        <div style={{textAlign: 'center'}}>
            <h3>Counter App3</h3>
            <div>
                <Button variant="contained" onClick={increment}>+</Button>
                <span> {count} </span>
                <Button variant="contained" onClick={decrement}>-</Button>
            </div>
            <Link to='/Counter'>Counter</Link><br/>
            <Link to='/Counter2'>Counter2</Link><br/>
            <Link to='/'>Home</Link>
        </div>
    );
};

export default Counter;