

    export interface HEADER {
        TALLYREQUEST: string;
    }

    export interface STATICVARIABLES {
        SVCURRENTCOMPANY: string;
    }

    export interface REQUESTDESC {
        REPORTNAME: string;
        STATICVARIABLES: STATICVARIABLES;
    }

    export interface ADDRESSLIST {
        ADDRESS: string;
        _TYPE: string;
    }



    export interface OLDAUDITENTRYIDSLIST {
        OLDAUDITENTRYIDS: string;
        _TYPE: string;
    }

    export interface LEDGERENTRIESLIST {
        OLDAUDITENTRYIDS_LIST: OLDAUDITENTRYIDSLIST;
        ROUNDTYPE: string;
        LEDGERNAME: string;
        METHODTYPE: string;
        GSTCLASS: string;
        ISDEEMEDPOSITIVE: string;
        LEDGERFROMITEM: string;
        REMOVEZEROENTRIES: string;
        ISPARTYLEDGER: string;
        ISLASTDEEMEDPOSITIVE: string;
        ISCAPVATTAXALTERED: string;
        ISCAPVATNOTCLAIMED: string;
        AMOUNT: string;
        VATEXPAMOUNT: string;
        SERVICETAXDETAILS_LIST: string;
        BANKALLOCATIONS_LIST: string;
        BILLALLOCATIONS_LIST: string;
        INTERESTCOLLECTION_LIST: string;
        OLDAUDITENTRIES_LIST: string;
        ACCOUNTAUDITENTRIES_LIST: string;
        AUDITENTRIES_LIST: string;
        INPUTCRALLOCS_LIST: string;
        DUTYHEADDETAILS_LIST: string;
        EXCISEDUTYHEADDETAILS_LIST: string;
        RATEDETAILS_LIST: string;
        SUMMARYALLOCS_LIST: string;
        STPYMTDETAILS_LIST: string;
        EXCISEPAYMENTALLOCATIONS_LIST: string;
        TAXBILLALLOCATIONS_LIST: string;
        TAXOBJECTALLOCATIONS_LIST: string;
        TDSEXPENSEALLOCATIONS_LIST: string;
        VATSTATUTORYDETAILS_LIST: string;
        COSTTRACKALLOCATIONS_LIST: string;
        REFVOUCHERDETAILS_LIST: string;
        INVOICEWISEDETAILS_LIST: string;
        VATITCDETAILS_LIST: string;
        ADVANCETAXDETAILS_LIST: string;
        ROUNDLIMIT: string;
        POSPAYMENTTYPE: string;
    }

    export interface EXPIRYPERIOD {
        _JD: string;
        _P: string;
        __text: string;
    }

    export interface BATCHALLOCATIONSLIST {
        MFDON: string;
        GODOWNNAME: string;
        BATCHNAME: string;
        INDENTNO: string;
        ORDERNO: string;
        TRACKINGNUMBER: string;
        DYNAMICCSTISCLEARED: string;
        AMOUNT: string;
        ACTUALQTY: string;
        BILLEDQTY: string;
        EXPIRYPERIOD: EXPIRYPERIOD;
        ADDITIONALDETAILS_LIST: string;
        VOUCHERCOMPONENTLIST_LIST: string;
    }



    export interface ACCOUNTINGALLOCATIONSLIST {
        OLDAUDITENTRYIDS_LIST: OLDAUDITENTRYIDSLIST;
        LEDGERNAME: string;
        CLASSRATE: string;
        GSTCLASS: string;
        GSTOVRDNNATURE: string;
        ISDEEMEDPOSITIVE: string;
        LEDGERFROMITEM: string;
        REMOVEZEROENTRIES: string;
        ISPARTYLEDGER: string;
        ISLASTDEEMEDPOSITIVE: string;
        ISCAPVATTAXALTERED: string;
        ISCAPVATNOTCLAIMED: string;
        AMOUNT: string;
        SERVICETAXDETAILS_LIST: string;
        BANKALLOCATIONS_LIST: string;
        BILLALLOCATIONS_LIST: string;
        INTERESTCOLLECTION_LIST: string;
        OLDAUDITENTRIES_LIST: string;
        ACCOUNTAUDITENTRIES_LIST: string;
        AUDITENTRIES_LIST: string;
        INPUTCRALLOCS_LIST: string;
        DUTYHEADDETAILS_LIST: string;
        EXCISEDUTYHEADDETAILS_LIST: string;
        RATEDETAILS_LIST: string;
        SUMMARYALLOCS_LIST: string;
        STPYMTDETAILS_LIST: string;
        EXCISEPAYMENTALLOCATIONS_LIST: string;
        TAXBILLALLOCATIONS_LIST: string;
        TAXOBJECTALLOCATIONS_LIST: string;
        TDSEXPENSEALLOCATIONS_LIST: string;
        VATSTATUTORYDETAILS_LIST: string;
        COSTTRACKALLOCATIONS_LIST: string;
        REFVOUCHERDETAILS_LIST: string;
        INVOICEWISEDETAILS_LIST: string;
        VATITCDETAILS_LIST: string;
        ADVANCETAXDETAILS_LIST: string;
    }

    export interface ALLINVENTORYENTRIESLIST {
        STOCKITEMNAME: string;
        ISDEEMEDPOSITIVE: string;
        ISLASTDEEMEDPOSITIVE: string;
        ISAUTONEGATE: string;
        ISCUSTOMSCLEARANCE: string;
        ISTRACKCOMPONENT: string;
        ISTRACKPRODUCTION: string;
        ISPRIMARYITEM: string;
        ISSCRAP: string;
        RATE: string;
        AMOUNT: string;
        ACTUALQTY: string;
        BILLEDQTY: string;
        BATCHALLOCATIONS_LIST: BATCHALLOCATIONSLIST;
        ACCOUNTINGALLOCATIONS_LIST: ACCOUNTINGALLOCATIONSLIST;
        DUTYHEADDETAILS_LIST: string;
        SUPPLEMENTARYDUTYHEADDETAILS_LIST: string;
        TAXOBJECTALLOCATIONS_LIST: string;
        REFVOUCHERDETAILS_LIST: string;
        EXCISEALLOCATIONS_LIST: string;
        EXPENSEALLOCATIONS_LIST: string;
    }

    export interface VOUCHER {
        ADDRESS_LIST: ADDRESSLIST;
        OLDAUDITENTRYIDS_LIST: OLDAUDITENTRYIDSLIST;
        DATE: string;
        GUID: string;
        NARRATION: string;
        BASICVOUCHERCHEQUENAME: string;
        STATENAME: string;
        GSTREGISTRATIONTYPE: string;
        PRICELEVEL: string;
        CLASSNAME: string;
        POSCASHLEDGER: string;
        VOUCHERTYPENAME: string;
        VOUCHERNUMBER: string;
        PARTYLEDGERNAME: string;
        CSTFORMISSUETYPE: string;
        CSTFORMRECVTYPE: string;
        FBTPAYMENTTYPE: string;
        PERSISTEDVIEW: string;
        PLACEOFSUPPLY: string;
        BASICBUYERNAME: string;
        VCHGSTCLASS: string;
        ENTEREDBY: string;
        DIFFACTUALQTY: string;
        ISMSTFROMSYNC: string;
        ASORIGINAL: string;
        AUDITED: string;
        FORJOBCOSTING: string;
        ISOPTIONAL: string;
        EFFECTIVEDATE: string;
        USEFOREXCISE: string;
        ISFORJOBWORKIN: string;
        ALLOWCONSUMPTION: string;
        USEFORINTEREST: string;
        USEFORGAINLOSS: string;
        USEFORGODOWNTRANSFER: string;
        USEFORCOMPOUND: string;
        USEFORSERVICETAX: string;
        ISEXCISEVOUCHER: string;
        EXCISETAXOVERRIDE: string;
        USEFORTAXUNITTRANSFER: string;
        IGNOREPOSVALIDATION: string;
        EXCISEOPENING: string;
        USEFORFINALPRODUCTION: string;
        ISTDSOVERRIDDEN: string;
        ISTCSOVERRIDDEN: string;
        ISTDSTCSCASHVCH: string;
        INCLUDEADVPYMTVCH: string;
        ISSUBWORKSCONTRACT: string;
        ISVATOVERRIDDEN: string;
        IGNOREORIGVCHDATE: string;
        ISVATPAIDATCUSTOMS: string;
        ISDECLAREDTOCUSTOMS: string;
        ISSERVICETAXOVERRIDDEN: string;
        ISISDVOUCHER: string;
        ISEXCISEOVERRIDDEN: string;
        ISEXCISESUPPLYVCH: string;
        ISGSTOVERRIDDEN: string;
        GSTNOTEXPORTED: string;
        IGNOREGSTINVALIDATION: string;
        ISVATPRINCIPALACCOUNT: string;
        ISBOENOTAPPLICABLE: string;
        ISSHIPPINGWITHINSTATE: string;
        ISOVERSEASTOURISTTRANS: string;
        ISDESIGNATEDZONEPARTY: string;
        ISCANCELLED: string;
        HASCASHFLOW: string;
        ISPOSTDATED: string;
        USETRACKINGNUMBER: string;
        ISINVOICE: string;
        MFGJOURNAL: string;
        HASDISCOUNTS: string;
        ASPAYSLIP: string;
        ISCOSTCENTRE: string;
        ISSTXNONREALIZEDVCH: string;
        ISEXCISEMANUFACTURERON: string;
        ISBLANKCHEQUE: string;
        ISVOID: string;
        ISONHOLD: string;
        ORDERLINESTATUS: string;
        VATISAGNSTCANCSALES: string;
        VATISPURCEXEMPTED: string;
        ISVATRESTAXINVOICE: string;
        VATISASSESABLECALCVCH: string;
        ISVATDUTYPAID: string;
        ISDELIVERYSAMEASCONSIGNEE: string;
        ISDISPATCHSAMEASCONSIGNOR: string;
        ISDELETED: string;
        CHANGEVCHMODE: string;
        ALTERID: string;
        MASTERID: string;
        VOUCHERKEY: string;
        POSCASHRECEIVED: string;
        EXCLUDEDTAXATIONS_LIST: string;
        OLDAUDITENTRIES_LIST: string;
        ACCOUNTAUDITENTRIES_LIST: string;
        AUDITENTRIES_LIST: string;
        DUTYHEADDETAILS_LIST: string;
        SUPPLEMENTARYDUTYHEADDETAILS_LIST: string;
        EWAYBILLDETAILS_LIST: string;
        INVOICEDELNOTES_LIST: string;
        INVOICEORDERLIST_LIST: string;
        INVOICEINDENTLIST_LIST: string;
        ATTENDANCEENTRIES_LIST: string;
        ORIGINVOICEDETAILS_LIST: string;
        INVOICEEXPORTLIST_LIST: string;
        LEDGERENTRIES_LIST: LEDGERENTRIESLIST[];
        ALLINVENTORYENTRIES_LIST: ALLINVENTORYENTRIESLIST[];
        ALLLEDGERENTRIES_LIST: ALLLEDGERENTRIESLIST[];
        PAYROLLMODEOFPAYMENT_LIST: string;
        ATTDRECORDS_LIST: string;
        GSTEWAYCONSIGNORADDRESS_LIST: string;
        GSTEWAYCONSIGNEEADDRESS_LIST: string;
        TEMPGSTRATEDETAILS_LIST: string;
        _REMOTEID: string;
        _VCHKEY: string;
        _VCHTYPE: string;
        _ACTION: string;
        _OBJVIEW: string;
    }

    export interface REMOTECMPINFOLIST {
        NAME: string;
        REMOTECMPNAME: string;
        REMOTECMPSTATE: string;
        _MERGE: string;
    }

    export interface COMPANY {
        REMOTECMPINFO_LIST: REMOTECMPINFOLIST;
    }

    export interface TALLYMESSAGE {
        VOUCHER: VOUCHER;
        COMPANY: COMPANY;
    }

    export interface REQUESTDATA {
        TALLYMESSAGE: TALLYMESSAGE[];
    }

    export interface IMPORTDATA {
        REQUESTDESC: REQUESTDESC;
        REQUESTDATA: REQUESTDATA;
    }

    export interface BODY {
        IMPORTDATA: IMPORTDATA;
    }

    export interface ENVELOPE {
        HEADER: HEADER;
        BODY: BODY;
    }

    export interface AccountingVoucher {
        ENVELOPE: ENVELOPE;
    }

    export interface ALLLEDGERENTRIESLIST {
        OLDAUDITENTRYIDS_LIST: OLDAUDITENTRYIDSLIST;
        LEDGERNAME: string;
        GSTCLASS: string;
        ISDEEMEDPOSITIVE: string;
        LEDGERFROMITEM: string;
        REMOVEZEROENTRIES: string;
        ISPARTYLEDGER: string;
        ISLASTDEEMEDPOSITIVE: string;
        ISCAPVATTAXALTERED: string;
        ISCAPVATNOTCLAIMED: string;
        AMOUNT: Number;
        SERVICETAXDETAILS_LIST: string;
        BANKALLOCATIONS_LIST: string;
        BILLALLOCATIONS_LIST: string;
        INTERESTCOLLECTION_LIST: string;
        OLDAUDITENTRIES_LIST: string;
        ACCOUNTAUDITENTRIES_LIST: string;
        AUDITENTRIES_LIST: string;
        INPUTCRALLOCS_LIST: string;
        DUTYHEADDETAILS_LIST: string;
        EXCISEDUTYHEADDETAILS_LIST: string;
        RATEDETAILS_LIST: string;
        SUMMARYALLOCS_LIST: string;
        STPYMTDETAILS_LIST: string;
        EXCISEPAYMENTALLOCATIONS_LIST: string;
        TAXBILLALLOCATIONS_LIST: string;
        TAXOBJECTALLOCATIONS_LIST: string;
        TDSEXPENSEALLOCATIONS_LIST: string;
        VATSTATUTORYDETAILS_LIST: string;
        COSTTRACKALLOCATIONS_LIST: string;
        REFVOUCHERDETAILS_LIST: string;
        INVOICEWISEDETAILS_LIST: string;
        VATITCDETAILS_LIST: string;
        ADVANCETAXDETAILS_LIST: string;
    }
