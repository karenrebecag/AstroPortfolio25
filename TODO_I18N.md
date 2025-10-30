# TODO: Internationalization

This file contains the pending tasks for the internationalization of the project.

## 1. `src/components/Home/Me/ExperienceSlider.tsx`

The `ExperienceSlider.tsx` component has a hardcoded "Read More" button that needs to be internationalized.

### Instructions

1.  Open the file `src/components/Home/Me/ExperienceSlider.tsx`.
2.  Import the `t` function from `../../../../i18n/utils.js`.
3.  Add a `lang` prop to the `ExperienceSliderProps` interface.
4.  Receive the `lang` prop in the component.
5.  Replace the hardcoded text "Read More" with `{t('me.readMore', lang)}`.

## 2. `src/components/modules/Reviews/components/ServiceReviewsIsland.tsx`

The `ServiceReviewsIsland.tsx` component has a hardcoded "Submit a Review" button that needs to be internationalized.

### Instructions

1.  Open the file `src/components/modules/Reviews/components/ServiceReviewsIsland.tsx`.
2.  Import the `t` function from `../../../../i18n/utils.js`.
3.  Add a `lang` prop to the `ServiceReviewsIslandProps` interface.
4.  Receive the `lang` prop in the component.
5.  Replace the hardcoded text "Submit a Review" with `{t('reviews.submit', lang)}`.

## 3. `src/Projects/case-study-template.astro`

This file is a template and seems to use mock data. The internationalization of this component should be done when the real data is fetched from the CMS. However, there are some static titles that can be translated.

- `Our Workflow`
- `A streamlined process for success`
- `Solutions`
- `Final Toughts`

### Instructions

1.  Add the corresponding keys to the `translations.js` file for all languages.
2.  Open the file `src/Projects/case-study-template.astro`.
3.  Import the `t` function from `../i18n/utils.js`.
4.  Get the `lang` from the URL.
5.  Replace the hardcoded titles with the translated values.
