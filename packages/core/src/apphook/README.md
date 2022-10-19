# apphook - Hook Engine 


Hooks is a way to implant/modify other piece of code.

Computer software is a sort of sequence. We build software according to the business.

However, the user's behaviors are out-of-sequence and chaos.

You will never know what users want, how they use your software, what they want to customization.

So, we need to prepare a system to deal with out-of-sequence and chaos, which can make big changes and flexible customization available.

That's why we should know `AppHook`.

`AppHook` is a hooks engine which Event-Driven. It can intercept users' behaviors and extend our functionalities.

## Principle

We place AppHook hooks in code and trigger event.

For example, when user click the button A,  we can trigger a event called "click:button:A"

We have two way to trigger event:

1. Trigger. When event appear, do some actions or behaviors, it would not change code pipeline path.
2. Filter. When event appear, it will do some actions and behaviors, return a object. It can be an interceptor.


## Use Case

- Event Tracking：Don't need to hard code in the code anymore, we can put all event tracking code in the file by bind and unbind.
- Rookie Onboarding: New register user onboarding
- Help Guiding: when the 10th click on a button, popup a UI window.
- Users Tasks: check whether user finished some tasks.
- Marketing Events: If match some condition, do something like popup a marketing ui windows.
- Users Recall: If user has not login 30 days, do something.
- Payment Interception: When click a feature button, users have no payment yet, trigger and open a UI windows until payment finished and go on.
- Third Party: customize 3rd plugins or more features
- ......

## Terms

- hook：
    - hookState：
    - hookArgs：
- binding：
    - add_trigger：
    - remove_trigger：
    - add_filter：
    - remove_filter：
- trigger
    - triggerCommand:
    - triggerCommandArg ：any
- filter：
    - filterCommand:
    - filterCommandArg:
- rule 
    - condition
    - conditionArgs
- action:
    - trigger action: 
        - trigger command: 
        - arg: 
    - filter action: 
        - filter command: 
        - filter command arg: 
- listener ：
    - trigger Listner：
    - filter Listner：




## Example

### Use Trigger to Event Tracking

```typescript
// Window.tsx
// ...
onClickLoginButton: () => {
    // ...
    apphook.doTrigger('user:click_login_button');

}
// ...
```

```typescript
//  EventTracking.ts, a independent file for event tracking 
apphook.addTrigger('user:click_login_button', (args) => {

    // Event Tracking Code
    EventTracking.track('user:click_login_button', {...});

    tracker.track('user:click_login_button', {...});
    tracker.setProfile({email:'xxx@xxx.com'});
});
```


### Use Filter, make contact number nickname customizable

```typescript
apphook.addFilter('get_form_name', (defaultValue, args) => {
    let user = args[0];
    if (user.is_cloud) {
        return "Member ID";
    } else if (user.is_self_hosted) {
        return "Employee ID";
    }
    return defaultValue;
});
```

```typescript
// UI.tsx
<Form name="{apphook.applyFilters('get_form_name', 'ID')}" />  
// Here will get the result "Member ID" or "Employee ID" or "ID"
```

## Rookie popup guiding

If you want: 
> When a female user get into your product the 10 times, popup "congratulation, you have used 10 times"

Break it down:

- trigger: user get into the 10th times
    - hook: get into product(application:start)
    - hookState: the 10th times
    - rule: female
        - condition: gender == femail
    - action: 
        - command: popup
        - command: "congratulation, you have used 10 times"
        

Relevant code:
```typescript
// trigger event
apphook.doTrigger('application:start', [],  10) // the 10th times get in

// add trigger
apphook.addTrigger('application:start', (args, hookState) => {
    if (hookState == 10) {
        showWindow('congratulation, you have used 10 times');
    }
}, {
    doCheck: (args) => {
            return user.gender === 'female';
}});
```

    
