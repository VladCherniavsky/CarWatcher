/**
 * Created by vlad on 1/24/2017.
 */
import sendRequest from '../../utils/sendRequest';
import cheerio from 'cheerio';
import * as helper from '../../utils/helper';
import config from '../../config';

const memoryCach = {
    cars: []
};


function surfaceTraverse(url, traverseAllPage) {
    let options = {
        url: url ? url : config.get('av.by:url'),
        method: 'GET'
    };
    sendRequest(options)
        .then((html) => {
            let $ = cheerio.load(html, {
                withDomLvl1: true,
                normalizeWhitespace: true,
                xmlMode: false,
                decodeEntities: true
            });
            const carsObj = $('.listing').find('.listing-item-title > h4 > a');

            const activePage = $(config.get('av.by:selectors:pagesRoot'))
                .find(config.get('av.by:selectors:activePage')).attr('href');

            const allPages = $(config.get('av.by:selectors:pagesRoot'))
                .find(config.get('av.by:selectors:allPages'))
                .map((index, item) => {
                    console.log('item', item.attribs.href);
                    return item.attribs.href;
                })
                .get();

            const activePageIndex = allPages.indexOf(activePage);

            const arrayOfCar = helper.convertToArray(carsObj);


            arrayOfCar.forEach((item) => {
                if (!memoryCach.cars.includes(item.children[0].data)) {
                    memoryCach.cars.push(item.children[0].data);
                    deepTraverse(item.attribs.href);
                   // deepTraverse(item.attribs.href);
                    /* .then((carInfo) => {
                        console.log('carInfo', carInfo);
                    });*/
                }
            });
            traverseAllPage
                ? surfaceTraverse(allPages[activePageIndex + 1])
                : surfaceTraverse(url);
        })
        .catch(console.error);
}

function deepTraverse(url) {
    console.log('url', url);
    let options = {
        url: 'https://cars.av.by/honda/accord/12365284',
        method: 'GET'
    };

    return sendRequest(options)
        .then(gotHtml)
        .catch(console.error);

    async function gotHtml(html) {
        let $ = cheerio.load(html, {
            withDomLvl1: true,
            normalizeWhitespace: true,
            xmlMode: false,
            decodeEntities: true
        });
        const info = {};
        info.link = options.url;
        info.title = $('.card-title').text();
        info.priceMain = $('.card-price-main > span').text().replace(/\D/g, '');
        info.priceUsd = $('.card-price-approx').text().replace(/\D/g, '');
        info.sellerName = $('.card-contacts-name').text().trim();
        const city = $('.card-contacts-city').text().split(',');
        let phoneLink = $('.card-contacts-phones > a').attr('data-phone-action');
        const id = $('.card-contacts-phones > a').attr('data-ads-id');
        console.log('phoneLink', phoneLink);
        console.log('id', id);
        info.id = id;
        phoneLink = phoneLink + '?id=' + id;
        info.phoneLink = phoneLink;
        if (city.length > 1) {
            info.city = city[0].trim();
            info.region = city[1].trim();
        } else {
            info.city = city[0].trim();
        }

        $(config.get('av.by:selectors:cardInfoList'))
            .each((ind, item)=> {
                let propName = config.get('av.by:cardOptions:'
                    + getNameOfNode($, item, 'dt', true));
                if (propName) {
                    info[propName] = getNameOfNode($, item, 'dd').trim();
                }
            });
        const phones = await getPhone(phoneLink);
        info.phones = phones;

        return info;
    }

    function getNameOfNode($, item, node, split) {
        return split
            ? $(item).find(node).text().split(' ').join('').toLowerCase()
            : $(item).find(node).text().toLowerCase();
    }

    function getPhone(url) {
        const options = {
            url: url,
            method: 'GET',
            headers: {
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': 'https://cars.av.by',
                'X-Requested-With': 'XMLHttpRequest'
            }
        };
        return sendRequest(options)
            .then((data) => {
                data = data.replace(/\\/g, '');
                return data.result && !data.url
                    ? data.data
                    : 'Empty';
            })
            .catch(console.error);
    }
}


export {surfaceTraverse};
export {deepTraverse};

