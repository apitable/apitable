import {TableBundleSnapshot} from "./table_bundle_snapshot";

export class TableBundleDataSheet{
    public snapshot: TableBundleSnapshot;

    public constructor(snapshot: TableBundleSnapshot) {
      this.snapshot = snapshot;
    }
}
