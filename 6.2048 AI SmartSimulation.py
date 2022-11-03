from gym import Env
from gym.spaces import Discrete, Box
import numpy as np
import math
import random
import copy
import os

from selenium import webdriver
import time
from selenium.webdriver.common.action_chains import ActionChains as ac
from selenium.webdriver.common.keys import Keys
import webbrowser

#Web integration code

driver = webdriver.Chrome('./chromedriver')

htmlFile = os.path.abspath('webpage.html')
driver.get(htmlFile)


mainBody = driver.find_element_by_tag_name('html')
giveLoc = driver.find_element_by_id('giveLoc')
giveVal = driver.find_element_by_id('giveVal')

class Env2048(Env):
    def __init__(self):
        self.counter = 0
        #actions we can take
        self.action_space = Discrete(4)
        #Observation space array
        self.observation_space = Box(0, 100000, shape = (1,16), dtype = np.int32)
        #Starting state
        self._state = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]


    def shift(self,e1,e2,e3,e4,checker):
          #Makes a list of all the non-x's
        shiftedState = []

        if self._state[e1] != 0:
            shiftedState.append(self._state[e1])
        if self._state[e2] != 0:
            shiftedState.append(self._state[e2])
        if self._state[e3] != 0:
            shiftedState.append(self._state[e3])
        if self._state[e4] != 0:
            shiftedState.append(self._state[e4])
                

        #Puts the x's in their correct place
        if len(shiftedState) == 1:
            self._state[e1] = 0
            self._state[e2] = 0
            self._state[e3] = 0
            self._state[e4] = shiftedState[0]
        if len(shiftedState) == 2:
            self._state[e1] = 0
            self._state[e2] = 0
            self._state[e3] = shiftedState[0]
            self._state[e4] = shiftedState[1]
        if len(shiftedState) == 3:
            self._state[e1] = 0
            self._state[e2] = shiftedState[0]
            self._state[e3] = shiftedState[1]
            self._state[e4] = shiftedState[2]

        #fusion
            
        if checker == 0: 
            if  self._state[e4] != 0 and self._state[e3] != 0 and int(self._state[e4]) == int(self._state[e3]):
                self._state[e4] = int(self._state[e4])*2
                self._state[e3] = 0
            if  self._state[e3] != 0 and self._state[e2] != 0 and int(self._state[e3]) == int(self._state[e2]) :
                self._state[e3] = int(self._state[e3])*2
                self._state[e2] = 0
            if self._state[e2] != 0 and self._state[e1] != 0 and int(self._state[e2]) == int(self._state[e1]):
                self._state[e2] = int(self._state[e2])*2
                self._state[e1] = 0
                
        #Post fusion, shifts everything one more time to remove spaces.
                
        if checker == 0:               
            if self._state[e3] != 0 and self._state[e4] == 0 or self._state[e2] != 0 and self._state[e3] == 0 or self._state[e1] != 0 and self._state[e2] == 0:
                self.shift(e1,e2,e3,e4,1)

    def checkUpDown(self):
        checker = False
        for i in range (0,15):
            if self._state[i] == 0:
                checker = True
        if self._state[0] == self._state[1] or self._state[1] == self._state[2] or self._state[2] == self._state[3]:
            checker = True
        if self._state[4] == self._state[5] or self._state[5] == self._state[6] or self._state[6] == self._state[7]:
            checker = True
        if self._state[8] == self._state[9] or self._state[9] == self._state[10] or self._state[10] == self._state[11]:
            checker = True
        if self._state[12] == self._state[13] or self._state[13] == self._state[14] or self._state[14] == self._state[15]:
            checker = True
        return checker
    def checkLeftRight(self):
        checker = False
        if self._state[0] == self._state[4] or self._state[4] == self._state[8] or self._state[8] == self._state[12]:
            checker = True
        if self._state[1] == self._state[5] or self._state[5] == self._state[9] or self._state[9] == self._state[13]:
            checker = True
        if self._state[2] == self._state[6] or self._state[6] == self._state[10] or self._state[10] == self._state[14]:
            checker = True
        if self._state[3] == self._state[7] or self._state[7] == self._state[11] or self._state[11] == self._state[15]:
            checker = True
        return checker

    def boardScore(self):
        bigNumber = 0 
        for i in self._state:
            if i != 0:
                bigNumber += math.log(2,i)
            else:
                bigNumber += 100
        bigNumber += self._state[0] * 25
        bigNumber += self._state[1] * 12
        bigNumber += self._state[2] * 8
        bigNumber += self._state[3] * 3
        return bigNumber
        
    def spawner (self,real):
        #lists our remaining choices
        choices = []
        spawn = [2,4]
        for i in range (0,16):
            if self._state[i] == 0:
                choices.append(i)
                
        if len(choices) != 0:
            locChoice = random.choices(choices)[0]
            valChoice = random.choices(spawn,weights = (90,10),k=1)[0]
            
            self._state[locChoice] = valChoice
            if real:
                giveLoc.send_keys(str(locChoice))        
                giveVal.send_keys(str(valChoice))        
        

    def step(self,action,ignore):
        reward = 0
        if not self.checkUpDown() and not self.checkLeftRight() and all(i != 0 for i in self._state) or self.counter == 100 and ignore: 
            done = True
            counter = 0
            #print('GAME OVER')
        else:
            done = False

            #upmove
        if action == 0 and not done:
                lastState = copy.deepcopy(self._state)
                self.shift(12,8,4,0,0)
                self.shift(13,9,5,1,0)
                self.shift(14,10,6,2,0)
                self.shift(15,11,7,3,0)
                if not ignore:
                    self.spawner(True)
                else:
                    self.spawner(False)
                self.counter += 1
                if lastState != self._state:
                    reward = self.boardScore()
                else:
                    reward = -10
    
        elif action == 1 and not done:
                lastState = copy.deepcopy(self._state)
                self.shift(0,4,8,12,0)
                self.shift(1,5,9,13,0)
                self.shift(2,6,10,14,0)
                self.shift(3,7,11,15,0)
                if not ignore:
                    self.spawner(True)
                else:
                    self.spawner(False)
                self.counter += 1
                if lastState != self._state:
                    reward = self.boardScore()
                else:
                    reward = -10
                
        
        elif action == 2 and not done:
                lastState = copy.deepcopy(self._state)
                self.shift(3,2,1,0,0)
                self.shift(7,6,5,4,0)
                self.shift(11,10,9,8,0)
                self.shift(15,14,13,12,0)
                if not ignore:
                    self.spawner(True)
                else:
                    self.spawner(False)
                self.counter += 1
                if lastState != self._state:
                    reward = self.boardScore()
                else:
                    reward = -10

        elif action == 3 and not done:
                lastState = copy.deepcopy(self._state)
                self.shift(0,1,2,3,0)
                self.shift(4,5,6,7,0)
                self.shift(8,9,10,11,0)
                self.shift(12,13,14,15,0)
                if not ignore:
                    self.spawner(True)
                else:
                    self.spawner(False)
                self.counter += 1
                if lastState != self._state:
                    reward = self.boardScore()
                else:
                    reward = -10

        info = {}

        return self._state, reward, done, info


    def render(self,mode):
        print()
        print('' , self._state[0:4], '\n', self._state[4:8], '\n', self._state[8:12], '\n', self._state[12:16])

    def playFrom(self,feedMe):
        self._state = feedMe
        self.counter = 0
        reward = 0 

    def reset(self):
        self._state = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        self.counter = 0
        return self._state

def simulate(givenState):
    listOfMoves = []
    
    for episode in range (1,300):    
        copyGivenState = copy.deepcopy(givenState)  
        env.playFrom(copyGivenState)
        score = 0
        done = False
        counterSimul = 0
        firstMove = 0

        while not done:
            if counterSimul == 0:
                action = env.action_space.sample()
                firstMove = action
                counterSimul += 1
            else:
                action = env.action_space.sample()
            n_state,reward,done,info = env.step(action,True)
            score+= reward

        listOfMoves.append([firstMove,score])

    sum0 = 0
    noOf0 = 0
    sum1 = 0
    noOf1 = 0
    sum2 = 0
    noOf2 = 0
    sum3 = 0
    noOf3 = 0

    for i in listOfMoves:
        if i[0] == 0:
            sum0 += i[1]
            noOf0 += 1

        elif i[0] == 1:
            sum1 += i[1]
            noOf1 += 1

        elif i[0] == 2:
            sum2 += i[1]
            noOf2 += 1

        elif i[0] == 3:
            sum3 += i[1]
            noOf3 += 1
        
    best = max(sum0/noOf0,sum1/noOf1, sum2/noOf2,sum3/noOf3)
    env.playFrom(givenState)

    if best == sum0/noOf0:
        return 0
    elif best == sum1/noOf1:
        return 1
    elif best == sum2/noOf2:
        return 2
    elif best == sum3/noOf3:
        return 3


env = Env2048()

#Save my state as it is, run a simulation, feed my current state in, make an action, get a state back, save my state 


done = False
holdState = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

while not done:
    nextAction = simulate(holdState)

    giveLoc.clear()
    giveVal.clear()

    if nextAction == 0:
        mainBody.send_keys(Keys.UP)
    elif nextAction == 1:
        mainBody.send_keys(Keys.DOWN)
    elif nextAction == 2:
        mainBody.send_keys(Keys.LEFT)
    elif nextAction == 3:
        mainBody.send_keys(Keys.RIGHT)
    n_state,reward,done,info = env.step(nextAction,False)

    holdState = copy.deepcopy(n_state)
    printThis = env.render('human')





