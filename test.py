import csv
import json
import re

def is_category(text):
    # Detect if text is all caps and not empty
    return bool(text) and text.strip() == text.strip().upper() and not text.strip().isdigit()

def csv_to_json(csv_file, json_file):
    data = []
    current_category = None

    with open(csv_file, newline='', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            test_name = row['TEST'].strip()
            price_raw = row['New Walk In (Prices in Naira)'].strip()

            if is_category(test_name) and not price_raw:
                # New category
                current_category = test_name.title()
            elif test_name and price_raw:
                # It's a test under current category
                try:
                    price = int(re.sub(r'[^\d]', '', price_raw))  # Remove commas, ₦ symbols, etc.
                except ValueError:
                    price = None
                data.append({
                    "category": current_category,
                    "test": test_name.title(),
                    "price": price
                })

    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✅ Successfully wrote {len(data)} tests to {json_file}")


if __name__ == "__main__":
    csv_to_json("tests.csv", "tests.json")
