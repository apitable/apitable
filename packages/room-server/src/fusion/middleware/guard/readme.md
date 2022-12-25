# guard

A collection of FusionApi guards
## Fusion Api guard
### Dependencies
```
ApiDatasheetGuard -- UnitMemberRepository
ApiSpaceGuard -- UnitMemberRepository
```

The above dependencies need to be introduced in the module using guard, there will be no circular dependencies
```
TypeOrmModule.forFeature([UnitMemberRepository, ApiUsageRepository])
```

