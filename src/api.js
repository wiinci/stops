import axios from 'axios';

const client = axios.create({ responseType: 'json' });
const stops = 'https://transit.land/api/v1/stops';
const times = 'https://transit.land/api/v1/schedule_stop_pairs';
const zip = 'https://public.opendatasoft.com/api/records/1.0/search/';

const stopParams = {
  headway_dates: 'today',
  include: 'headways',
  per_page: 10,
  r: 400,
};

const timeParams = {
  date: 'today',
  origin_departure_between: 'now,now+1200',
};

const zipParams = {
  dataset: 'us-zip-code-latitude-and-longitude',
  rows: 1,
};

export default {
  async execute(method, baseURL, params) {
    return client({
      baseURL,
      method,
      params,
    }).then(req => req.data);
  },

  getStops({ lat, lon }) {
    return this.execute('get', stops, { ...stopParams, lat, lon });
  },

  // eslint-disable-next-line camelcase
  getTimes({ operator_onestop_id, origin_onestop_id }) {
    return this.execute('get', times, {
      ...timeParams,
      operator_onestop_id,
      origin_onestop_id,
    });
  },

  getLatLonfromZip({ q }) {
    return this.execute('get', zip, { ...zipParams, q });
  },
};
