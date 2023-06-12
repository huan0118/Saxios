'use strict';

import AxiosURLSearchParams from '../../../util/AxiosURLSearchParams';
export default typeof URLSearchParams !== 'undefined' ? URLSearchParams : AxiosURLSearchParams;
