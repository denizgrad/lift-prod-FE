(function (angular) {
    angular
        .module('enumService', [])
        .factory('enumService', enumService);

    enumService.$inject = [];

    function enumService () {
        const
            KEY_CODE = {
                ENTER: 13,
                ESCAPE: 27,
                SPACE: 32,
                LEFT_ARROW : 37,
                UP_ARROW : 38,
                RIGHT_ARROW : 39,
                DOWN_ARROW : 40,
                BACKSPACE: 8,
                DELETE: 46
            },
            ROLES = {
                ORG_ADMIN: 'Firma Admin'
            },
            ERRORS = {
                SERVER: 'SERVER_ERROR',
                UNIQUE: 'UNIQUE_ERROR',
                NOT_FOUND: 'RECORD_NOT_FOUND',
                NOT_DELETED: 'RECORD_NOT_DELETED'
            },
            MODULE_NAMES = {
                Stock: 'Stok',
                StockAction: 'Stok Hareketi',
            },
            FIELD_TYPE = {
                INTEGER: '4',
                FLOAT: '3',
                TEXT: '2',
                BOOLEAN: '1'
            },
            CURRENCY = {
                TRY: {id: 'TRY', symbol: '₺'},
                USD: {id: 'USD', symbol: '$'},
                EUR: {id: 'EUR', symbol: '€'},
            },
            STOCK = {
                ACTION: {
                    GIRIS: {id: '1', display: 'Giriş', defaultSelected: true},
                    CIKIS: {id: '2', display: 'Çıkış'},
                },
                TYPES: {
                    LABOUR: {id: '1', display: 'İşçilik'},
                    SPAREPART: {id: '2', display: 'Yedek Parça', defaultSelected: true},
                    STOCK: {id: '3', display: 'Sarf Malzeme'},
                    OTHER: {id: '4', display: 'Diğer'},
                },
                ORIGINAL_TYPE: {
                    ORIGINAL: {id: '1', display: 'Orijinal', defaultSelected: true},
                    ESDEGER: {id: '2', display: 'Eş değer'},
                    CIKMA: {id: '3', display: 'Çıkma'}
                }
            },
            UNIT_TYPES = {
                TYPES: {
                    PIECE: {id: '1', display: 'Adet', defaultSelected: true},
                    LENGTH: {id: '2', display: 'Uzunluk'},
                    WEIGHT: {id: '3', display: 'Ağırlık'},
                    VOLUME: {id: '4', display: 'Hacim'},
                },
                MAIN_UNIT: {
                    ADET: {id: '1-1', parent_id: '1', display: 'Adet', defaultSelected: true},
                    KM: {id: '2-1', parent_id: '2', display: 'Kilometre(km)'},
                    METRE: {id: '2-4', parent_id: '2', display: 'Metre(m)', defaultSelected: true},
                    CM: {id: '2-6', parent_id: '2', display: 'Santimetre(cm)'},
                    MM: {id: '2-7', parent_id: '2', display: 'Milimetre(mm)'},
                    KG: {id: '3-1', parent_id: '3', display: 'Kilogram(kg)', defaultSelected: true},
                    GR: {id: '3-2', parent_id: '3', display: 'Gram(gr)'},
                    CG: {id: '3-3', parent_id: '3', display: 'Santigram(cg)'},
                    MG: {id: '3-4', parent_id: '3', display: 'Miligram(mg)'},
                    LT: {id: '4-1', parent_id: '4', display: 'Litre(l)', defaultSelected: true},
                    DL: {id: '4-2', parent_id: '4', display: 'Desilitre(dl)'},
                    CL: {id: '4-3', parent_id: '4', display: 'Santilitre(cl)'},
                    ML: {id: '4-4', parent_id: '4', display: 'Mililitre(ml)'},
                    M3: {id: '4-5', parent_id: '4', display: 'Metreküp(m³)', defaultSelected: true},
                    DM3: {id: '4-6', parent_id: '4', display: 'Desilitre(dm³)'},
                    CM3: {id: '4-7', parent_id: '4', display: 'Santilitre(cm³)'},
                    MM3: {id: '4-8', parent_id: '4', display: 'Mililitre(mm³)'},
                }
            },
            ANALYSIS_CATEGORY = {
                machine_engine: {
                    id: 'machine_engine', display: 'Makine Motor',
                    settingsKeys: ['kapasite', 'motor_gucu', 'motor_tipi', 'motor_hizi', 'tahrik_tipi'],
                },
                cabin: {
                    id: 'cabin', display: 'Kabin',
                    settingsKeys: ['kapasite', 'tahrik_tipi', 'materyal']
                },
                door: {
                    id: 'door', display: 'Kapı',
                    settingsKeys: ['kapi_paneli', 'kaplama_tipi', 'panel_olcusu']
                },
                rail: {
                    id: 'rail', display: 'Ray',
                    settingsKeys: ['ray_tipi', 'ray_olcusu']
                },
                control_panel: {
                    id: 'control_panel', display: 'Kumanda Panosu',
                    settingsKeys: ['kumanda_pano_tipi', 'max_kat_sayisi', 'kapasite', 'motor_gucu', 'materyal', 'tahrik_tipi']
                },
                console: {
                    id: 'console', display: 'Konsol',
                    settingsKeys: ['konsol_tipi', 'tahrik_tipi']
                },
                regulator: {
                    id: 'regulator', display: 'Regülatör',
                    settingsKeys: ['motor_hizi', 'mensei']
                },
                tirnak: {id: 'tirnak', display: 'Tırnak', settingsKeys: ['tirna_tipi', 'tirnak_model']},
                halat: {id: 'halat', display: 'Halat', settingsKeys: ['halat_tipi']},
                other: {id: 'other', display: 'Diğer',
                    settingsKeys: ['other']
                },
            },
            ANALYSIS_SETTINGS = {
                DYNAMIC_SINGLE_RECORDS: {
                    max_kat_sayisi: {
                        id: 'max_kat_sayisi', display: 'Kat Sayısı (Max)',
                        value_type: 'number', parser:parseInt
                    }
                },
                DYNAMIC_LIST_RECORDS: {
                    kapasite: {
                        id: 'kapasite', display: 'Kapasite', suffix: 'KG',
                        value_type: 'number', parser:parseInt, mIcon: 'dns',
                    },
                    motor_gucu: {
                        id: 'motor_gucu', display: 'Motor Gücü', suffix: 'KW',
                        value_type: 'number', parser: parseFloat, mIcon: 'memory'
                    },
                    motor_tipi: {
                        id: 'motor_tipi', display: 'Motor Tipi', mIcon: 'sync'
                    },
                    motor_hizi: {
                        id: 'motor_hizi', display: 'Motor Hızı', suffix: 'M/SN',
                        value_type: 'number', parser:parseFloat, mIcon: 'import_export'
                    },
                    // kapı özellikleri
                    kaplama_tipi: {
                        id: 'kaplama_tipi', display: 'Kapı Kaplama Tipi',
                    },
                    panel_olcusu: {
                        id: 'panel_olcusu', display: 'Kapı Panel Ölçüsü', suffix: 'mm'
                    },
                    // kabin özellikleri
                    materyal: {
                        id: 'materyal', display: 'Materyal', mIcon: 'bookmarks'
                    }
                },
                STATIC_RECORDS: {
                    tahrik_tipi: {
                        id: 'tahrik_tipi', display: 'Tahrik Tipi',
                        items: [
                            {field_key: 'tahrik_tipi', field_value: 'Makine Daireli'},
                            {field_key: 'tahrik_tipi', field_value: 'Makine Dairesiz'},
                        ]
                    },
                    mensei: {
                        id: 'mensei', display: 'Menşei',
                        items: [
                            {field_key: 'mensei', field_value: 'Yerli'},
                            {field_key: 'mensei', field_value: 'İthal'},
                        ]
                    },
                    kapi_paneli: {
                        id: 'kapi_paneli', display: 'Kapı Paneli',
                        items: [
                            {field_key: 'kapi_paneli', field_value: '2 PANEL TELESKOPİK veya Merkezi'},
                            {field_key: 'kapi_paneli', field_value: '3 PANEL TELESKOPİK'},
                        ]
                    },
                    ray_tipi: {
                        id: 'ray_tipi', display: 'Ray Tipi',
                        items: [
                            {field_key: 'ray_tipi', field_value: 'Ray'},
                            {field_key: 'ray_tipi', field_value: 'Flanş'}
                        ],
                    },
                    ray_olcusu: {
                        id: 'ray_olcusu', display: 'Ray Ölçüsü', suffix: 'mm',
                        items: [
                            {field_key: 'ray_olcusu', field_value: '50x50x5'},
                            {field_key: 'ray_olcusu', field_value: '70x65x9'},
                            {field_key: 'ray_olcusu', field_value: '90x75x16'},
                            {field_key: 'ray_olcusu', field_value: '125x82x16'},
                        ]
                    },
                    konsol_tipi: {
                        id: 'konsol_tipi', display: 'Konsol Tipi',
                        items: [
                            {field_key: 'konsol_tipi', field_value: 'AĞIRLIK ŞASESİ'},
                            {field_key: 'konsol_tipi', field_value: 'MAKİNE ŞASESİ'},
                            {field_key: 'konsol_tipi', field_value: 'KONSOL BOYALI'},
                            {field_key: 'konsol_tipi', field_value: 'KONSOL GALVANİZLİ'},
                            {field_key: 'konsol_tipi', field_value: 'FİKSPUNT'},
                            {field_key: 'konsol_tipi', field_value: 'PANO SEHPASI'},
                            {field_key: 'konsol_tipi', field_value: 'TAMPON ALTI SEHPA TAKIM'},
                            {field_key: 'konsol_tipi', field_value: 'LİR'},
                        ]
                    },
                    kumanda_pano_tipi: {
                        id: 'kumanda_pano_tipi', display: 'Ürün Tipi',
                        items: [
                            {field_key: 'kumanda_pano_tipi', field_value: 'Kumanda Panosu'},
                            {field_key: 'kumanda_pano_tipi', field_value: 'Kat Butonu'},
                            {field_key: 'kumanda_pano_tipi', field_value: 'Kabin Butonu'},
                            {field_key: 'kumanda_pano_tipi', field_value: 'Yatay Kabin Butonu'},
                            {field_key: 'kumanda_pano_tipi', field_value: 'Rifit Kart'},
                        ]
                    },
                    halat_tipi: {
                        id: 'halat_tipi', display: 'Halat Tipi', suffix: 'mm', value_type: 'number',
                        items: [
                            {field_key: 'halat_tipi', field_value: 6},
                            {field_key: 'halat_tipi', field_value: 6.5},
                            {field_key: 'halat_tipi', field_value: 8},
                            {field_key: 'halat_tipi', field_value: 10},
                            {field_key: 'halat_tipi', field_value: 11},
                            {field_key: 'halat_tipi', field_value: 12},
                            {field_key: 'halat_tipi', field_value: 13},
                            {field_key: 'halat_tipi', field_value: 14},
                        ],
                    },
                    tirnak_tipi: {
                        id: 'tirnak_tipi', display: 'Tırnak Tipi',
                        items: [
                            {field_key: 'tirnak_tipi', field_value: 'DÖKÜM'},
                            {field_key: 'tirnak_tipi', field_value: 'SAC'},
                        ]
                    },
                    tirnak_model: {
                        id: 'tirnak_model', display: 'Tırnak Modeli',
                        items: [
                            {field_key: 'tirnak_model', field_value: 'T1'},
                            {field_key: 'tirnak_model', field_value: 'T2'},
                            {field_key: 'tirnak_model', field_value: 'T3'},
                            {field_key: 'tirnak_model', field_value: 'T4'},
                        ]
                    },
                    other: {
                        id: 'other', display: 'Diğer Tip Tanımları',
                        items: [
                            {field_key: 'other', field_value: 'Civata'},
                            {field_key: 'other', field_value: 'Çelik Dübel'},
                        ]
                    },
                }
            };

        return {
            findEnumById: findEnumById,
            getFieldTypes: getFieldTypes,
            getStockTypes: getStockTypes,
            getUnitTypes: getUnitTypes,
            getSubUnitTypes: getMainUnitTypes,
            getStockActionTypes: getStockActionTypes,
            MODULE_NAMES: MODULE_NAMES,
            ERRORS: ERRORS,
            ROLES: ROLES,
            KEY_CODE: KEY_CODE,
            FIELD_TYPE: FIELD_TYPE,
            UNIT_TYPES: UNIT_TYPES,
            CURRENCY: CURRENCY,
            ANALYSIS_CATEGORY: ANALYSIS_CATEGORY,
            ANALYSIS_SETTINGS: ANALYSIS_SETTINGS
        };

        function getStockTypes () {
            let items = Object.values(STOCK.TYPES);
            return {
                label: 'Malzeme Tipi',
                items: items
            }
        }

        function getUnitTypes () {
            return {
                label: 'Birim Tipi',
                items: Object.values(UNIT_TYPES.TYPES)
            }
        }

        function getMainUnitTypes () {
            return {
                label: 'Esas Birim',
                items: Object.values(UNIT_TYPES.MAIN_UNIT)
            }
        }

        function getStockActionTypes () {
            return {
                label: 'İşlem Tipi',
                items: Object.values(STOCK.ACTION)
            }
        }

        function getFieldTypes () {
            return {
                label: 'Alan Tanımı',
                items: [
                    {id: FIELD_TYPE.TEXT, fieldType: 'text', display: 'Yazı'},
                    {id: FIELD_TYPE.INTEGER, fieldType: 'integer', display: 'Sayı'},
                    {id: FIELD_TYPE.FLOAT, fieldType: 'float', display: 'Ondalıklı Sayı'},
                    {id: FIELD_TYPE.BOOLEAN, fieldType: 'boolean', display: 'Var/Yok'},
                ]
            }
        }
        /**
         * Find enum by id
         * @param {array} enumList
         * @param {string} enumId
         * @returns object
         */
        function findEnumById (enumList, enumId) {
            let foundItem = {id: enumId, display: '(Bilinmiyor)'};
            enumList.forEach((item)=>{
                if (item.id === enumId)
                    foundItem = item;
                    return foundItem;
            });
            return foundItem
        }
    }
})(window.angular);