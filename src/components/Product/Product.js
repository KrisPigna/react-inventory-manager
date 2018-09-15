import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Product.scss';
import { setProduct } from '../../actions/inventoryActions';

class Product extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showTitleInput: false,
            showBodyInput: false,
            title: this.props.product.title,
            body: this.props.product.body
        }

        this.showInput = this.showInput.bind(this);
        this.hideInput = this.hideInput.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    // Changes text to editable input field when a user clicks to edit it
    showInput(e) {
        this.setState({[e.target.id]: true});
    }

    // Changes input field back to text
    hideInput(e) {
        this.setState({[e.target.id]: false});
    }

    //Saves the new title and body for the selected product
    onSave(e) {
        var index = this.props.inventory.indexOf(this.props.product);
        this.props.inventory[index].title = this.state.title;
        this.props.inventory[index].body = this.state.body;
        this.setState({[e.target.id]: false});
    }

    // Binds input field to state variable
    onChange(e) {
        this.setState({[e.target.id]: e.target.value});
    }

    render() {
        return (
            <div className="product-page">
                <div>
                    <h3>Product Details</h3>
                    Click a field to edit
                </div>
                <div className="product">
                    <div>
                        Name
                    </div>
                    <div id="title">
                        { 
                            this.state.showTitleInput 
                            ? 
                            <div>
                                <input type="text" id="title" value={this.state.title} onChange={this.onChange}/>
                                <button id="showTitleInput" onClick={this.onSave}>Save</button>
                                <button id="showTitleInput" onClick={this.hideInput}>Cancel</button>
                            </div> 
                            : 
                            <p id="showTitleInput" onClick={this.showInput}>{this.props.product.title}</p>
                        }
                    </div>
                    <div>
                        Description
                    </div>
                    <div id="body">
                        { 
                            this.state.showBodyInput 
                            ? 
                            <div>
                                <textarea rows="5" id="body" value={this.state.body} onChange={this.onChange}/>
                                <br/>
                                <button id="showBodyInput" onClick={this.onSave}>Save</button>
                                <button id="showBodyInput" onClick={this.hideInput}>Cancel</button>
                            </div> 
                            : 
                            <p id="showBodyInput" onClick={this.showInput}>{this.props.product.body}</p>
                        }
                    </div>
                </div>
                <Link to="/">Back to Inventory</Link>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    inventory: state.inventory.products,
    product: state.inventory.product
});

export default connect(mapStateToProps, {setProduct})(Product);