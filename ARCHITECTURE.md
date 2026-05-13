# MozhiType — Architecture & Tamil Number System

## Project Structure

```
src/app/
├── app.ts                        # Root component with nav bar
├── app.html                      # Nav + router-outlet
├── app.routes.ts                 # Lazy-loaded routes
├── core/
│   ├── tamil-transliteration.ts  # Pure transliteration engine (no Angular)
│   └── transliteration.service.ts# Injectable wrapper around the engine
├── components/
│   ├── copy-button/              # Clipboard copy with 2s feedback
│   ├── keyboard-reference/       # Collapsible cheat-sheet panel
│   ├── output-display/           # Read-only Tamil output box
│   ├── suggestion-popup/         # Backspace-triggered similar-letter popup
│   └── transliteration-input/    # Textarea with live preview
└── pages/
    ├── typing-page/              # / — phonetic typing interface
    ├── converter-page/           # /converter — Tamil numeral → Arabic
    └── not-found-page/           # ** — 404
```

All components are **standalone** (Angular v20+, no NgModules), use **OnPush** change
detection, and manage state exclusively through **signals** and **computed()**.

---

## Tamil Numeral System — Complete Reference

### The Three Place Markers

Tamil has three named place markers (not digits):

| Symbol | Name             | Value |
| ------ | ---------------- | ----- |
| ௰      | பத்து (Pathu)    | 10    |
| ௱      | நூறு (Nooru)     | 100   |
| ௲      | ஆயிரம் (Aayiram) | 1,000 |

Tamil digits 1–9:

| Symbol | Value |
| ------ | ----- |
| ௧      | 1     |
| ௨      | 2     |
| ௩      | 3     |
| ௪      | 4     |
| ௫      | 5     |
| ௬      | 6     |
| ௭      | 7     |
| ௮      | 8     |
| ௯      | 9     |

There is **no Tamil zero** — 0 stays as the Arabic `0`.

---

### Writing Numbers: The Rules

#### Rule 1 — Units (1–9)

Write the digit symbol directly.

```
௧ = 1    ௫ = 5    ௯ = 9
```

#### Rule 2 — Tens, Hundreds, Thousands: digit × marker

A digit placed **before** a place marker multiplies it:

```
௨௰  = 2 × 10  = 20
௫௱  = 5 × 100 = 500
௮௲  = 8 × 1000 = 8,000
```

When the digit is **1**, omit it (the marker alone implies 1×):

```
௰   = 1 × 10  = 10   (not ௧௰)
௱   = 1 × 100 = 100
௲   = 1 × 1000 = 1,000
```

#### Rule 3 — Compound numbers: add groups left to right

Each (digit + marker) group is written independently, largest to smallest.
The groups are **additive** between themselves:

```
௱௫௰௬  = 100 + 50 + 6 = 156
          │   │   │   └─ digit 6 (units)
          │   │   └───── ௫ × ௰ = 50
          │   └───────── (no digit prefix) ௱ = 100
          └───────────── 100

௨௲௨௰௬  = 2,000 + 20 + 6 = 2,026
```

---

### Powers of 10 Beyond 1,000: The Multiplicative Chain

This is the most distinctive aspect of the Tamil system.
To represent powers of 10 greater than 1,000, place markers **multiply each other**.

#### Core pattern

Between any two ௲ markers there are exactly **two ௱ markers**.

Reading a chain left to right, each marker multiplies the value accumulated so far:

```
௰ × ௲  = 10 × 1,000    = 10,000
௱ × ௲  = 100 × 1,000   = 1,00,000   (1 lakh)
௰ × ௱ × ௲  = 10 × 100 × 1,000 = 10,00,000   (10 lakhs)
௱ × ௱ × ௲  = 100 × 100 × 1,000 = 1,00,00,000  (1 crore)
```

#### Reference table for powers of 10

| Power | Chain  | Value           | Western name |
| ----- | ------ | --------------- | ------------ |
| 10¹   | ௰      | 10              | Ten          |
| 10²   | ௱      | 100             | Hundred      |
| 10³   | ௲      | 1,000           | Thousand     |
| 10⁴   | ௰௲     | 10,000          | Ten thousand |
| 10⁵   | ௱௲     | 1,00,000        | Lakh         |
| 10⁶   | ௰௱௲    | 10,00,000       | 10 lakhs     |
| 10⁷   | ௱௱௲    | 1,00,00,000     | Crore        |
| 10⁸   | ௰௱௱௲   | 10,00,00,000    | 10 crore     |
| 10⁹   | ௱௱௱௲   | 1,00,00,00,000  | 100 crore    |
| 10¹⁰  | ௲௱௱௲   | 10,00,00,00,000 | 1,000 crore  |
| 10¹¹  | ௰௲௱௱௲  | 10,000 crore    |              |
| 10¹²  | ௱௲௱௱௲  | 1 lakh crore    | Trillion     |
| 10¹³  | ௰௱௲௱௱௲ | 10 lakh crore   |              |
| 10¹⁴  | ௱௱௲௱௱௲ | 1 crore crore   |              |

#### The decomposition formula

For a power `n ≥ 3`, decompose as:

```
n  =  leftover  +  (groups × 7)  +  3

leftover ∈ {0..6} → prefix tokens:
  0 → ""
  1 → ௰
  2 → ௱
  3 → ௰ ௱
  4 → ௱ ௱
  5 → ௰ ௱ ௱
  6 → ௱ ௱ ௱

Each group adds:  ௲ ௱ ௱

Base: ௲
```

Example — 10⁷ (crore):

```
n = 7
r = 7 - 3 = 4
groups = ⌊4/7⌋ = 0
left   = 4 % 7  = 4  → ௱ ௱
chain  = ௱ ௱ + ௲ = ௱ ௱ ௲  ✓
```

Example — 10¹⁰:

```
n = 10
r = 10 - 3 = 7
groups = ⌊7/7⌋ = 1
left   = 7 % 7  = 0  → ""
chain  = "" + ௲ ௱ ௱ + ௲ = ௲ ௱ ௱ ௲  ✓
```

---

### Writing Composite Large Numbers

For each non-zero digit `d` at position `i` (0 = units, 1 = tens, …):

1. If `i = 0`: write the Tamil digit symbol
2. If `i > 0` and `d = 1`: write only the power chain (digit 1 is implicit)
3. If `i > 0` and `d > 1`: write the Tamil digit, then the power chain

Then concatenate all groups from most significant to least significant.

#### Example — 1,000,156 (10 lakh + 156)

```
1 at position 6  →  powerChain(6) = ௰ ௱ ௲   (1 × 10⁶)
1 at position 2  →  powerChain(2) = ௱          (1 × 10²)
5 at position 1  →  ௫ + ௰                      (5 × 10)
6 at position 0  →  ௬                           (6)

Result: ௰௱௲௱௫௰௬
```

---

### Parsing Back to Arabic (How the Converter Works)

The converter in `/converter` reverses this process using greedy chain matching:

1. Precompute all power chain strings for 10¹ … 10²⁰
2. Sort them longest-first (to avoid ௲ matching before ௲௱௱௲)
3. Scan left to right:
   - Optionally consume a Tamil digit → coefficient (default 1)
   - Match the longest power chain → multiply coefficient × chain value
   - No chain after a digit → the digit is the units value
4. Sum all contributions

---

### Key Differences from Western/Indian Systems

| Aspect             | Western                    | Tamil                                       |
| ------------------ | -------------------------- | ------------------------------------------- |
| Base grouping      | Thousands (10³)            | Not fixed — chains extend by ×10² ×10² ×10³ |
| Zero               | Required placeholder       | Not used                                    |
| Large number names | Million, Billion…          | Lakh, Crore (shared with Indian)            |
| Positional writing | Right-to-left significance | Left-to-right, same                         |
| Digit × marker     | Implicit (positional)      | Explicit (e.g. ௨௰ for 20)                   |
| Markers multiply   | No                         | Yes — this is the unique Tamil feature      |

---

### Mnemonic for Digits 1–9

> **"கடலை உருண்டையை நன்கு சமைத்து ருசித்து சாப்பிடு என்று அம்மா கூறினார்"**

First letters: **க**=1 **உ**=2 **ந**=3 **ச**=4 **ரு**=5 **சா**=6 **எ**=7 **அ**=8 **கூ**=9
