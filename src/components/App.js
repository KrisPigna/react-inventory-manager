import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Inventory from './Inventory/Inventory';
import ProductForm from './ProductForm/ProductForm';
import Product from './Product/Product';

class App extends Component {
    componentWillMount() {
        window.alert("Note: For live demo purposes, the inventory is populated with lorem ipsum objects from https://jsonplaceholder.typicode.com/. Create, edit, and delete are fully functional, but changes are reset if the window is closed or refreshed.")
    }
    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div>
                        <ProductForm />
                        <Route exact path="" component={Inventory} />
                        <Route path="/product" component={Product}/>
                    </div>
                </Router>
            </Provider>
        )
    }
}

export default App;