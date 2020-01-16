import axios from 'axios'

import { createStore, combineReducers, applyMiddleware } from 'redux'
// 处理异步的 redux
import ReduxThunk from 'redux-thunk'

import { composeWithDevTools } from 'redux-devtools-extension'

// 定义初始值状态
/* const initialState = {
    count: 0
} */
/* const userInitialState = {
    username: '西凉鸡霸',
    age: 18,
    local: '西凉'
} */
const userInitialState = {}
const LOGOUT = 'LOGOUT'

// 定义一个动作函数，返回一个对象（可以包含type动作类型，一些额外的参数内容）
/* export function add(num) {
    return {
        type: 'ADD',
        num,
    }
} */
// 异步的动作函数
/* function addAsync(num) {
    console.log(num)
    return (dispatch) => {
        setTimeout(() => {
            dispatch(add(num))
        }, 5000)
    }
} */

// 定义Reducer
/* function countReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD':
            return { count: state.count + (action.num || 1) }
        default:
            return state
    }
} */
/* const UPDATE_USERNAME = 'UPDATE_USERNAME'
function userRducer(state = userInitialState, action) {
    // console.log(state, action)
    switch (action.type) {
        case UPDATE_USERNAME:
            return {
                ...state, //  对象解构
                username: action.name,
                age: action.age
            }
        default:
            return state;
    }
} */
function userRducer(state = userInitialState, action) {
    switch (action.type) {
        case LOGOUT:
            return {}
        default:
            return state;
    }
}

// 合并Reducers
const allReducers = combineReducers({
    // count: countReducer,
    user: userRducer
})

// action creators
export function userLogout() {
    return dispatch => {
        axios
            .post("/logout")
            .then(resp => {
                if (resp.status === 200) {
                    dispatch({
                        type: LOGOUT
                    });
                } else {
                    console.log("logout failed", resp);
                }
            })
            .catch(err => {
                console.log("logout failed", err);
            });
    };
}

// 初始化创建store
/* const store = createStore(
    allReducers,
    {
        count: initialState,
        user: userInitialState
    },
    composeWithDevTools(applyMiddleware(ReduxThunk))
) */

// console.log(store.getState())
// store.dispatch({ type: 'ADD' })
// console.log(store.getState())

// store.dispatch(add(3))
// store.dispatch(addAsync(5))

/* store.subscribe(() => {
    console.log(store.getState())
})
 */
// store.dispatch({ type: 'UPDATE_USERNAME', name: '小丁丁', age: 26 })

const initializeStore = (state) => {
    const store = createStore(
        allReducers,
        Object.assign({}, {
            // count: initialState,
            user: userInitialState
        }, state),
        composeWithDevTools(applyMiddleware(ReduxThunk))
    )
    return store
}
// export default store
export default initializeStore