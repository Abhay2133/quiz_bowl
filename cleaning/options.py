from datetime import datetime
import pandas as pd

filename = 'tagline.csv'
# filename = input("filename : ")

# Load the data
df = pd.read_csv(filename)

# Function to replace answer with OPTION label
def replace_answer_with_option(row):
    if row['answer'] == row['option1']:
        return 'OPTION1'
    elif row['answer'] == row['option2']:
        return 'OPTION2'
    elif row['answer'] == row['option3']:
        return 'OPTION3'
    elif row['answer'] == row['option4']:
        return 'OPTION4'
    
    return row['answer']

# Apply the function to each row
df['answer'] = df.apply(replace_answer_with_option, axis=1)
df['type'] = df['type'].replace('text', 'TEXT')
df['difficulty'] = "EASY"
df['roundId'] = 4
df['updatedAt'] = datetime.now().isoformat()

# Save the modified DataFrame
df.to_csv(f"updated_{filename}", index=False)
