using {
    cuid,
    managed,
} from '@sap/cds/common';

// cuid can be used to generate an ID from system
namespace TRM;

entity rate : managed {
    
    key id          : String;
        RATE_TYPE   : String(1);
        FROM_CURR   : String(10);
        TO_CURRNCY  : String(10);
        VALID_FROM  : Date;
        EXCH_RATE   : Double;
        FROM_FACTOR : Int32;
        TO_FACTOR   : Int32;
}
