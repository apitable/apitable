# Notes:
#
# It requires GitHub CLI: " brew install gh jq "
#
# You may have to gh auth login if this is your first time using it
#
# Disable the workflow you want to delete (via Github console) before executing this script.

# Example:
# ./delete-workflow-runs.sh vikadata datasheet

OWNER=$1
REPO=$2

# Get workflow IDs with status "disabled_manually"
workflow_ids=($(gh api repos/"$OWNER"/"$REPO"/actions/workflows | jq '.workflows[] | select(.["state"] | contains("disabled_manually")) | .id'))

for workflow_id in "${workflow_ids[@]}"
do
  echo "Listing runs for the workflow ID $workflow_id"
  run_ids=( $(gh api repos/"$OWNER"/"$REPO"/actions/workflows/"$workflow_id"/runs --paginate | jq '.workflow_runs[].id') )
  for run_id in "${run_ids[@]}"
  do
    echo "Deleting Run ID $run_id"
    gh api repos/"$OWNER"/"$REPO"/actions/runs/"$run_id" -X DELETE >/dev/null
  done
done