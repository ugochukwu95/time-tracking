import React from 'react';
import { StyleSheet, Text, View, ScrollView, KeyboardAvoidingView } from 'react-native';
import EditableTimer from './components/EditableTimer';
import ToggleableTimerForm from './components/ToggleableTimerForm';
import uuidv4 from 'uuid/v4';
import { newTimer } from './utils/TimerUtils';

export default class App extends React.Component {
  state = {
    timers: [
      {
        title: 'Mow the lawn',
        project: 'House Chores',
        id: uuidv4(),
        elapsed: 5456099,
        isRunning: true,
      },
      {
        title: 'Bake squash',
        project: 'Kitchen Chores',
        id: uuidv4(),
        elapsed: 1273998,
        isRunning: false,
      },
    ]
  }

  componentDidMount() {
    const TIME_INTERVAL = 1000;

    this.intervalid = setInterval(() => {
      const {timers} = this.state;

      this.setState({
        timers: timers.map((timer) => {
          const { elapsed, isRunning } = timer;

          return {
            ...timer,
            elapsed: isRunning ? Number(elapsed + TIME_INTERVAL) : elapsed
          }
        })
      })
    }, TIME_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  toggleTimer = timerId => {
    this.setState(prevState => {
      const {timers} = prevState;

      return {
        timers: timers.map(timer => {
          const { id, isRunning } = timer;

          if (id === timerId) {
            return {
              ...timer, isRunning: !isRunning
            }
          }

          return timer;
        })
      }
    })
  }

  handleCreateFormSubmit = (timer) => {
    const {timers} = this.state;

    this.setState({timers: [newTimer(timer), ...timers]})
  }

  handleRemoveTimer = (id) => {
    const {timers} = this.state;

    this.setState({
      timers: timers.filter((obj) => {
        return obj.id !== id;
      })
    })
  }

  handleFormSubmit = attrs => {
    const {timers} = this.state;

    this.setState({
      timers: timers.map(timer => {
        if (timer.id == attrs.id) {
          const {title, project} = attrs;

          return {
            ...timer,
            title,
            project
          }
        }

        return timer;
      })
    })
  }

  render() {
    const {timers} = this.state;
    return (
      <View style={styles.appContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Timers</Text>
        </View>
        <KeyboardAvoidingView behavior="padding" style={styles.timerListContainer} >
          <ScrollView style={styles.timerList}>
            <ToggleableTimerForm isOpen={false} onFormSubmit={this.handleCreateFormSubmit} />
            {timers.map((obj) => <EditableTimer key={obj.id} id={obj.id} title={obj.title} project={obj.project} elapsed={obj.elapsed} isRunning={obj.isRunning} onFormSubmit={this.handleFormSubmit} onRemoveTimer={this.handleRemoveTimer} onStartPress={this.toggleTimer} onStopPress={this.toggleTimer} />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  titleContainer: {
    paddingTop: 35,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#D6D7DA',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerList: {
    paddingBottom: 15
  }, 
  timerListContainer: {
    flex: 1
  }
});
