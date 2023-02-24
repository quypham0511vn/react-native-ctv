Release note:

appcenter login

```
- Release iOS
```shell
appcenter codepush release-react -a tienngay/AppCTV-iOS -d Production
```

- Release Android
```shell
appcenter codepush release-react -a tienngay/AppCTV-Android -d Production
```

=======

Change key for specific environment
# app center: 

Android
┌────────────┬───────────────────────────────────────┐
│ Name       │ Key                                   │
├────────────┼───────────────────────────────────────┤
│ Production │ VVggFGwjTswr_-taVOIKe11xaZmXXkRE0ZLbt │
├────────────┼───────────────────────────────────────┤
│ Staging    │ 7CLsFy9vMcfC8ACgViBCFFK_QdvwkL_VFsjcA │
└────────────┴───────────────────────────────────────┘

iOS
┌────────────┬───────────────────────────────────────┐
│ Name       │ Key                                   │
├────────────┼───────────────────────────────────────┤
│ Staging    │ r04d6lI4ujgGNHrpM1PFJUwgG8Zqhpki9aucW │
├────────────┼───────────────────────────────────────┤
│ Production │ 5G1Io_hZfW7MO-U7DzZa8MSdEkzsvE3q95MtG │
└────────────┴───────────────────────────────────────┘

# bugsnag
key: 5b78c6f92c5652572cc61dbf0fce3afd

# create staging và Production key in Ios
appcenter codepush deployment add -a tienngay/AppCTV-iOS Production
appcenter codepush deployment add -a tienngay/AppCTV-iOS Staging
# create staging và Production key in Android
appcenter codepush deployment add -a tienngay/AppCTV-Android Production
appcenter codepush deployment add -a tienngay/AppCTV-Android Staging
# xem ds  staging và Production key
appcenter codepush deployment list -a tienngay/AppCTV-iOS -k
