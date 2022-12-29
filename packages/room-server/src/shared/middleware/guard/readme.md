# guard

FusionApi guard大集合
## Fusion Api guard
### 依赖列表
```
ApiDatasheetGuard -- UnitMemberRepository
ApiSpaceGuard -- UnitMemberRepository
```

以上依赖需要在使用guard的module中引入,不会存在循环依赖
```
TypeOrmModule.forFeature([UnitMemberRepository, ApiUsageRepository])
```

