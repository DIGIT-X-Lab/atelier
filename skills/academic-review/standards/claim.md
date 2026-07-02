# CLAIM — Checklist for Artificial Intelligence in Medical Imaging

*Encodes CLAIM (2020, updated 2024). A fast-start memory aid — confirm borderline calls against the live published checklist.*

## What it governs

Papers that develop, validate, or evaluate an AI/ML model on medical images — classification, detection, segmentation, CAD. If the headline result is a performance number (AUC, sensitivity, Dice) produced by a model on imaging data, CLAIM applies.

## Highest-yield checklist items

The items reviewers most often find violated:

1. **Data provenance & selection** — how were images/patients selected, from where, over what period? Undisclosed selection is a hidden source of bias.
2. **Train / validation / test split integrity** — splits made **at the patient level**, not the image/slice level (slices from one patient must not span train and test). This is the leakage check.
3. **External / independent test set** — is performance shown on data from a different site, scanner, or time period? Internal-only evaluation does not demonstrate generalization.
4. **Ground-truth definition** — how were reference labels established, by whom, with what expertise, and what was inter-rater agreement? A model can only be as good as its labels.
5. **Model transparency & reproducibility** — architecture, training procedure, hyperparameters, and code/weights availability sufficient to reproduce.
6. **Preprocessing fit on training data only** — normalization/augmentation parameters must not be computed over the full dataset.
7. **Handling of failure cases & missing data** — excluded scans, non-evaluable cases, and how they were counted.

## Review prompts

- Where exactly is the split made, and can a single patient's images appear in both train and test?
- Is there an external test set? If not, does the paper still claim clinical/generalizable utility?
- Who defined ground truth, and what was their agreement? What happens to the results if the labels are noisy?
- Could any preprocessing, feature selection, or threshold tuning have seen the test data?
