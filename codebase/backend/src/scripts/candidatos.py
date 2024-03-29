# pip install psycopg2
## dependências:
## sudo apt install libpq-dev python3-dev

# pip install python-decouple
# pip install pandas_ods_reader

import os
import sys
import psycopg2
from decouple import config
from pandas_ods_reader import read_ods

DB_NAME = config('DB_NAME')
DB_HOST = config('DB_HOST')
DB_USER = config('DB_USER')
DB_PASSWORD = config('DB_PASSWORD')
DB_PORT = config('DB_PORT')

conn = psycopg2.connect(
  database=DB_NAME,
  host=DB_HOST,
  user=DB_USER,
  password=DB_PASSWORD,
  port=DB_PORT
)
cursor = conn.cursor()

sys.stdout.write('reading file ' + sys.argv[1] + '.ods\n')
base_path = os.path.abspath('.') + '/src/odsFiles/' + sys.argv[1] + '.ods'
sheet_index = 1
df = read_ods(base_path , sheet_index)

sys.stdout.write('updating candidatos table')
# iterates over each line of the .ods document
for ind in df.index:
  formacaoEscolaPublica = False

  if df['formacaoEscolaPublica'][ind] == '1':
    formacaoEscolaPublica = True

  # insert a new line on the "Candidatos" table
  cursor.execute(
    'INSERT INTO "Candidatos" VALUES (DEFAULT, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
    (
      df['cpf'][ind],
      df['cargoId'][ind],
      None,
      None,
      sys.argv[2],
      df['numCandidato'][ind],
      df['corRaca'][ind],
      formacaoEscolaPublica,
      df['dataInscricao'][ind],
      df['programa'][ind],
      df['tipoPrograma'][ind],
      df['nomeComunidade'][ind],
      df['anoEnem'][ind]
    )
  )
  conn.commit()

sys.stdout.flush()
