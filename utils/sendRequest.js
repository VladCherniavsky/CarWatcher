/**
 * Created by vlad on 1/23/2017.
 */
import request from 'request';
/**
 * @module Utils: SendRequest
 */
/**
 * Send request by giving options object.
 * @function sendRequset.
 * @param {Object} options - The Options object for request.
 * @param {String} options.url - The url to send request.
 * @param {String} options.method - The  type of request (GET, POST..).
 * @param {Object} options.headers - The header's object.
 * @return {Promise} Returns the promise.
 */
function sendRequset(options) {
    return new Promise((resolve, reject) => {
        request(options, (err, response, html) => {
            return err ? reject(err) : resolve(html);
        });
    });
}
export default sendRequset;
