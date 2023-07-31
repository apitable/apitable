import { TableBundleSnapshot } from './table_bundle_snapshot';

export class TableBundleDataSheet{
    public snapshot: TableBundleSnapshot;
    public extras: any;

    public constructor(
      snapshot: TableBundleSnapshot,
      extras?: string
    ) {
      this.extras = extras;
      this.snapshot = snapshot;
    }
}