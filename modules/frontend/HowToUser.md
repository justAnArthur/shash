<!--- NOTE: use following code to access user and userId-->

```javascript
import {useAuth} from "src/lib/composables/useAuth";

const {user} = useAuth();
const userId = user.id;
console.log(userId);
```
