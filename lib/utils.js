import moment from 'moment'

export function getlastUpDatedTime(time) {
    return moment(time).fromNow()
}