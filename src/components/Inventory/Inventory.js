import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import { fetchInventory, setProduct } from '../../actions/inventoryActions';
import './Inventory.scss';

// React Bootstrap components
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import Table from 'react-bootstrap/lib/Table';
import Pagination from 'react-bootstrap/lib/Pagination';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import InputGroup from 'react-bootstrap/lib/InputGroup';

class Inventory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: [],
            currentPage: 1,
            searchTerm: "",
            searchParam: "title",
            showBody: []
        }

        this.onSortNumeric = this.onSortNumeric.bind(this);
        this.onSortAlpha = this.onSortAlpha.bind(this);
        this.setPageSize = this.setPageSize.bind(this);
        this.getPage = this.getPage.bind(this);
        this.setSearchParam = this.setSearchParam.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.allChecks = this.allChecks.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.editProduct = this.editProduct.bind(this);
        this.expandBody = this.expandBody.bind(this);
        this.generatePageMenu = this.generatePageMenu.bind(this);
        this.generateInventoryTable = this.generateInventoryTable.bind(this);

        // Populates inventory on first loading
        if (this.props.inventory.length === 0) {
            this.props.fetchInventory()
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.pages !== nextProps.pages || this.props.inventory !== nextProps.inventory) {
            this.props.setProduct({ userId: 0, id: 0, title: "placeholder", body: "placeholder" });
            this.setState({ page: nextProps.pages[0] });
            for (var i = 1; i <= nextProps.inventory.length; i++) {
                this.state.showBody.push(false);
            }
        }
    }

    componentWillMount() {
        this.setPageSize(null);
    }

    // Edit a product
    editProduct(e) {
        this.props.setProduct(this.props.inventory.find(product => product.id == e.target.name));
    }

    // Delete a product
    deleteProduct() {
        var index;
        var offset = 0;
        if (confirm("All selected products will be deleted. Continue?")) {
            var checkboxes = document.getElementsByTagName("input");
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].type == "checkbox") {
                    if (checkboxes[i].checked == true && checkboxes[i].name != "all") {
                        index = parseInt(checkboxes[i].name);
                        this.props.inventory.splice(index - offset, 1);
                        offset++;
                    }
                }
            }
            this.setPageSize(null);
        }
    }

    // Sets table contents to the user's selected page
    getPage(e) {
        this.setState({ page: this.props.pages[e.target.innerHTML - 1], currentPage: parseInt(e.target.innerHTML) });
    }

    // Sets the number of rows to display in a page (default is 10 upon component first loading)
    setPageSize(e) {
        var size = 10;
        if (e !== null) {
            if (e.target.innerHTML === "All") {
                size = this.props.inventory.length;
            }
            else {
                size = parseInt(e.target.innerHTML);
            }
        }

        // Empty current pages array
        while (this.props.pages.length > 0) {
            this.props.pages.pop();
        }

        // Refill pages array with new rows per page
        for (var i = 0; i < this.props.inventory.length; i += size) {
            this.props.pages.push(this.props.inventory.slice(i, i + size));
        }

        this.setState({ page: this.props.pages[0] });
    }

    // Function for numeric sorting
    onSortNumeric(e) {
        // Checks if current order is low-high, and reverses it
        if (this.props.inventory[0][e.target.innerHTML] > this.props.inventory[1][e.target.innerHTML]) {
            this.props.inventory.sort(function (a, b) { return a[e.target.innerHTML] - b[e.target.innerHTML] });
        }
        else {
            this.props.inventory.sort(function (a, b) { return b[e.target.innerHTML] - a[e.target.innerHTML] });
        }
        this.setPageSize(null);
    }

    // Function for alphabetic sorting
    onSortAlpha(e) {
        if (this.props.inventory[0][e.target.innerHTML] > this.props.inventory[1][e.target.innerHTML]) {
            this.props.inventory.sort(function (a, b) {
                var textA = a[e.target.innerHTML].toUpperCase();
                var textB = b[e.target.innerHTML].toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            })
        } else {
            this.props.inventory.sort(function (a, b) {
                var textA = a[e.target.innerHTML].toUpperCase();
                var textB = b[e.target.innerHTML].toUpperCase();
                return (textA < textB) ? 1 : (textA > textB) ? -1 : 0;
            })
        }
        this.setPageSize(null);
    }

    // Sets which parameter the search function searches by
    setSearchParam(e) {
        this.setState({ searchParam: e.target.innerHTML });
    }

    // Sets the state variable searchTerm as the user types and filters the inventory if there are any matches
    onSearch(e) {
        var size = 10;
        var filteredInventory;
        this.setState({ searchTerm: e.target.value });
        filteredInventory = this.props.inventory.filter(product => product[this.state.searchParam].includes(this.state.searchTerm));

        // Empty current pages array
        while (this.props.pages.length > 0) {
            this.props.pages.pop();
        }

        if (filteredInventory.length > 0) {
            // Refill pages array with new rows per page
            for (var i = 0; i < filteredInventory.length; i += size) {
                this.props.pages.push(filteredInventory.slice(i, i + size));
            }
        }

        this.setState({ page: this.props.pages[0] });
    }

    // Clears search bar and resets inventory
    clearSearch() {
        this.setState({ searchTerm: "" });
        this.setPageSize(null);
    }

    // Expands/collapses body table cell when the cell is clicked
    expandBody(e) {
        const expand = this.state.showBody;
        expand[e.target.id] = !expand[e.target.id];
        this.forceUpdate();
    }

    // Selects/deselects all checkmarks on a page
    allChecks(e) {
        let checkboxes = document.getElementsByTagName("input");
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == "checkbox") {
                if (e.target.checked == true && e.target != checkboxes[i]) {
                    checkboxes[i].checked = true;
                }
                else if (e.target.checked == false && e.target != checkboxes[i]) {
                    checkboxes[i].checked = false;
                }
            }
        }
    }

    // Handles display for pagination menu, depending on size
    generatePageMenu() {
        let pageMenu = [];

        // Menu when there are fewer than 6 pages
        if (this.props.pages.length < 6) {
            for (var i = 1; i <= this.props.pages.length; i++) {
                pageMenu.push(
                    <Pagination.Item key={i} onClick={this.getPage}>{i}</Pagination.Item>
                );
            }
        }

        // Menu when there are more than six pages, and current page is among the first three
        else if (this.state.currentPage < 4) {
            for (var i = 1; i <= 7; i++) {
                pageMenu.push(
                    <Pagination.Item key={i} onClick={this.getPage}>{i}</Pagination.Item>
                );
            }
            pageMenu.push(
                <Pagination.Ellipsis />
            );
           
            pageMenu.push(
                <Pagination.Item key={this.props.pages.length} onClick={this.getPage}>{this.props.pages.length}</Pagination.Item>
            );
        }

        // Menue when there are more than 6 pages, and current page is somewhere in the middle
        else if (this.state.currentPage >= 4 && this.state.currentPage < this.props.pages.length - 3) {
            pageMenu.push(
                <Pagination.Item key={1} onClick={this.getPage}>1</Pagination.Item>
            );
            pageMenu.push(
                <Pagination.Ellipsis />
            );
            for (var i = -2; i <= 2; i++) {
                pageMenu.push(
                    <Pagination.Item key={this.state.currentPage + i} onClick={this.getPage}>{this.state.currentPage + i}</Pagination.Item>
                );
            }
            pageMenu.push(
                <Pagination.Ellipsis />
            );
            pageMenu.push(
                <Pagination.Item key={this.props.pages.length} onClick={this.getPage}>{this.props.pages.length}</Pagination.Item>
            );
        }

        // Menu when there are more than 6 pages, and current page is amont the last three
        else if (this.state.currentPage >= this.props.pages.length - 3) {
            pageMenu.push(
                <Pagination.Item key={1} onClick={this.getPage}>1</Pagination.Item>
            );
            pageMenu.push(
                <Pagination.Ellipsis />
            );
            for (var i = this.props.pages.length - 6; i <= this.props.pages.length; i++) {
                pageMenu.push(
                    <Pagination.Item key={i} onClick={this.getPage}>{i}</Pagination.Item>
                );
            }
        }
        return pageMenu;
    }

    // Handles setting up inventory table presentation
    generateInventoryTable() {
        var inventory;
        if (this.state.page != undefined) {
            inventory = this.state.page.map(product => (
                <tr key={product.id}>
                    <th><input type="checkbox" name={this.props.inventory.indexOf(product)} /></th>
                    <th>{product.id}</th>
                    <th>{product.title}</th>
                    <th id={product.id} title="Click to expand/collapse" onClick={this.expandBody}>
                        {
                            this.state.showBody[product.id]
                                ?
                                product.body
                                :
                                product.body.substring(0, 20) + "..."
                        }
                    </th>
                    <th>
                        <Link to="/product" name={product.id} onClick={this.editProduct}>Edit</Link>
                    </th>
                </tr>
            ));
        }
        return inventory;
    }

    render() {
        // Set up for inventory table and page menu presentation
        let inventory = this.generateInventoryTable();
        let pageMenu = this.generatePageMenu();

        return (
            <div>
                <div className="menu-container">
                    <Navbar>
                        <Navbar.Header>
                            <Navbar.Brand>
                                Inventory
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>
                        <Navbar.Collapse>
                            <Nav>
                                {/* Dropdown button to select rows per page */}
                                <NavDropdown id="row-select" title="Rows">
                                    <MenuItem onClick={this.setPageSize}>10</MenuItem>
                                    <MenuItem onClick={this.setPageSize}>20</MenuItem>
                                    <MenuItem onClick={this.setPageSize}>30</MenuItem>
                                    <MenuItem onClick={this.setPageSize}>40</MenuItem>
                                    <MenuItem onClick={this.setPageSize}>50</MenuItem>
                                    <MenuItem onClick={this.setPageSize}>All</MenuItem>
                                </NavDropdown>
                                <Navbar.Form pullLeft>
                                    <FormGroup>
                                        <InputGroup>
                                            <FormControl type="text" onChange={this.onSearch} placeholder="Search" value={this.state.searchTerm} />
                                            <DropdownButton
                                                componentClass={InputGroup.Button}
                                                id="search-param"
                                                title={this.state.searchParam}
                                            >
                                                <MenuItem key="1" onClick={this.setSearchParam}>title</MenuItem>
                                                <MenuItem key="2" onClick={this.setSearchParam}>body</MenuItem>
                                            </DropdownButton>
                                        </InputGroup>
                                    </FormGroup>
                                </Navbar.Form>
                                <NavItem onClick={this.clearSearch}>Clear</NavItem>

                                <NavItem onClick={this.deleteProduct}>
                                    Delete <Glyphicon glyph="trash" />
                                </NavItem>
                            </Nav>
                        </Navbar.Collapse>

                    </Navbar>
                </div>

                {/* Pagination menu */}
                <div className="page-menu">
                    <Pagination bsSize="small">
                        {pageMenu}
                    </Pagination>
                </div>

                {/* Inventory table */}
                <div className="table-container">
                    <Table striped bordered condensed hover>
                        <thead>
                            <tr>
                                <th id="check"><input type="checkbox" name="all" onClick={this.allChecks} />All</th>
                                <th onClick={this.onSortNumeric} id="id" name="id">id</th>
                                <th onClick={this.onSortAlpha} id="title" name="title">title</th>
                                <th onClick={this.onSortAlpha} id="body" name="body">body</th>
                                <th id="edit"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory}
                        </tbody>
                    </Table>
                </div>
            </div >
        );
    }
}

Inventory.propTypes = {
    fetchInventory: PropTypes.func.isRequired,
    inventory: PropTypes.array.isRequired,
    pages: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    pages: state.inventory.pages,
    inventory: state.inventory.products,
    product: state.inventory.product
});

export default connect(mapStateToProps, { fetchInventory, setProduct })(Inventory);