import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createProduct } from '../../actions/inventoryActions';
import './ProductForm.scss'

import Button from 'react-bootstrap/lib/Button';
import Panel from 'react-bootstrap/lib/Panel';
import Alert from 'react-bootstrap/lib/Alert';

class ProductForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            productName: "",
            description: "",
            open: false,
            alert: false
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.dismissAlert = this.dismissAlert.bind(this);
    }

    // Adds created product to the end of the inventory array
    onSubmit(e) {
        e.preventDefault();

        if (this.state.productName != "" && this.state.description != "") {

            const product = {
                title: this.state.productName,
                body: this.state.description,
                id: this.props.inventory[this.props.inventory.length-1].id + 1
            };

            this.props.inventory.push(product);
            this.setState({ open: false, alert: true });
        }
    }

    // Clears out the "successfully saved" notification
    dismissAlert() {
        this.setState({ alert: false });
    }

    // Binds input field to state variable
    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div className="product-form">
                <Button onClick={() => this.setState({ open: !this.state.open })}>
                    Add New Product
                </Button>
                <br />
                <div className="create-form">
                    <Panel expanded={this.state.open}>
                        <Panel.Collapse>
                            <Panel.Body>
                                <form onSubmit={this.onSubmit}>
                                    <div>
                                        <label>Product Name</label><br></br>
                                        <input type="text" name="productName" onChange={this.onChange} value={this.state.productName} />
                                    </div>
                                    <div>
                                        <label>Description</label><br></br>
                                        <input type="text" name="description" onChange={this.onChange} value={this.state.description} />
                                    </div>
                                    <br></br>
                                    <button type="submit">Create</button>
                                </form>
                            </Panel.Body>
                        </Panel.Collapse>
                    </Panel>
                    <div id="alert">
                        {
                            this.state.alert
                                ?
                                <Alert bsStyle="success">
                                    <div>Saved successfully</div>
                                    <div><Button onClick={this.dismissAlert}>Dismiss</Button></div>
                                </Alert>
                                :
                                null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

ProductForm.propTypes = {
    createProduct: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    inventory: state.inventory.products,
    product: state.inventory.product
});

export default connect(mapStateToProps, { createProduct })(ProductForm);
