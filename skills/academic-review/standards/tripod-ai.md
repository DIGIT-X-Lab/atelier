# TRIPOD-AI — Transparent Reporting of a multivariable prediction model (AI/ML extension)

*Encodes TRIPOD-AI (2024), extending TRIPOD (2015). A fast-start memory aid — confirm borderline calls against the live published checklist.*

## What it governs

Studies developing and/or validating a **clinical prediction model** — diagnostic or prognostic — including ML models that estimate a risk or an outcome for individual patients. Applies whether the model is logistic regression or a neural network.

## Highest-yield checklist items

1. **Predictors defined a priori** — candidate predictors and outcome specified before modeling, not selected post hoc from what worked. Data-driven predictor selection must be reported as such.
2. **Calibration reported, not just discrimination** — AUC/c-statistic measures ranking; **calibration** (do predicted risks match observed frequencies?) is what makes a model clinically usable. A model reported with discrimination alone is incompletely evaluated.
3. **Sample size / events-per-variable (EPV)** — enough outcome events to support the number of predictors; an overfit model on too few events is a major validity threat.
4. **Handling of missing data** — how missingness was addressed (complete-case vs imputation); complete-case analysis on substantial missingness biases the model.
5. **Validation type** — apparent (same data), internal (cross-validation/bootstrap), or external (independent data). External validation is the strongest and most often absent.
6. **Outcome & predictor blinding** — were predictors assessed without knowledge of outcome, and vice versa?
7. **Model availability** — is the full model (coefficients, or the algorithm and weights) reported so it can be applied or checked?

## Review prompts

- Is calibration reported at all, or only discrimination? If only the c-statistic, is the model actually usable for decisions?
- Were predictors chosen before seeing the data, or selected by the modeling process? If the latter, is the resulting optimism accounted for?
- How many outcome events per candidate predictor? Is the model plausibly overfit?
- Is there external validation, or only internal? Does the claim exceed the validation shown?
