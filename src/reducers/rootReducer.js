import { combineReducers } from 'redux';
import InventoryReducer from './inventoryReducer';

export default combineReducers({
    inventory: InventoryReducer
})