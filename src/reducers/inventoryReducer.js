import { FETCH_INVENTORY, NEW_PRODUCT, SET_PRODUCT } from '../actions/types';

const initialState = {
    products: [],
    product: {},
    pages: [],
    page: []
}

export default function(state = initialState, action) {
    switch (action.type) {
        case FETCH_INVENTORY:
            return {
                ...state,
                products: action.payload.inventory,
                pages: action.payload.pages,
                page: action.payload.pages[0]
            };
        case SET_PRODUCT:
            return {
                ...state,
                product: action.payload
            };
        case NEW_PRODUCT:
            return {
                ...state,
                product: action.payload
            };
        default:
            return state;
    }
}