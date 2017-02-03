/**
 * Created by vlad on 1/23/2017.
 */
import * as helper from '../helper';
import chai from 'chai';

const expect = chai.expect;

chai.should();


describe('helper functions', ()=> {
    it('Convert object as associative array to array', ()=> {
        const obj = {
            a: '1',
            b: '2',
            c: '3',
            length: 3
        };
        const arr = helper.convertToArray(obj);
        arr.length.should.equal(3);
    });
    it('Get id from url', () => {
        const url = 'https://cars.av.by/hyundai/getz/12448300';
        const id = helper.getIdFromUrl(url);
        expect(id).to.equal(12448300);
    });
});
