using {TRM} from '../db/data-model';

service CatalogService @(path: '/CatalogService') {
    entity rate as projection on TRM.rate;
}
