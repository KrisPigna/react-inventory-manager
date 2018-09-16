import { FETCH_INVENTORY, NEW_PRODUCT, SET_PRODUCT } from './types';

export const fetchInventory = () => dispatch => {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(res => res.json())
        .then(inventory => {
            inventory.pop();
            var size = 10; var pages = [];
            for (var i = 0; i < inventory.length; i += size) {
                pages.push(inventory.slice(i, i + size));
            }
            dispatch({
                type: FETCH_INVENTORY,
                payload: { inventory, pages }
            })
        })
};

export const setProduct = (product) => dispatch => {
    dispatch({
        type: SET_PRODUCT,
        payload: product
    });
};

export const createProduct = (inventory, product) => dispatch => {
    inventory.push(product);
    var size = 10; var pages = [];
    for (var i = 0; i < inventory.length; i += size) {
        pages.push(inventory.slice(i, i + size));
    }
    dispatch({
        type: NEW_PRODUCT,
        payload: { inventory, pages }
    });
};