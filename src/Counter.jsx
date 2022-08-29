//Counter.jsx
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

function Counter(props) {
    let [count, setCount] = useState(0)

    function increment() {
        setCount(count + 1);
    }

    function decrement() {
        setCount(count - 1);
    }

    return(
        <div style={{textAlign: 'center'}}>
            <h3>Counter App</h3>
            <div>
                <Button variant="contained" onClick={increment}>+</Button>
                <span> {count} </span>
                <Button variant="contained" onClick={decrement}>-</Button>
            </div>
            <Link to='/Counter2'>Counter2</Link><br/>
            <Link to='/Counter3'>Counter3</Link><br/>
            <Link to='/'>Home</Link><br/>
            <img src='/redpanda.jpg' height={200} width={"auto"}/>
        </div>
    );
};

export default Counter;