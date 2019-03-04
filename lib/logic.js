/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */

/**
 * Submit vote
 * @param {test.Vote} vote The vote to be submitted.
 * @transaction
 */
async function Vote(vote) {
  
    // Don't allow a used ballot to be processed
    if(vote.ballot.used==true) {
        throw 'Ballot already used';
    } else if(vote.ballot.owner.hasVoted) {
        throw 'Voter alreay voted';
    }
	else{
    vote.ballot.owner.hasVoted = true;
      vote.ballot.owner.Choice=vote.newOwner.party.PartyName+vote.newOwner.firstName;
  const ParticipantRegistry=await getParticipantRegistry('test.Voter');
  await ParticipantRegistry.update(vote.ballot.owner);
    // Set new owner of vote
    vote.ballot.owner = vote.newOwner;
    // Mark ballot as used
    vote.ballot.used = true;
    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('test.Ballot');
    // Update the asset in the asset registry.
    await assetRegistry.update(vote.ballot);
 }
}
