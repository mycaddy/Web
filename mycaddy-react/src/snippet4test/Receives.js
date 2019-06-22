import React from 'react';
import { SampleConsumer } from '../snippet4test/context/sample'
/**
 * 
 
const Receives = () => {
  return (
    <SampleConsumer>
      {
        (data) => (
          <div>
            현재 설정된 값: { data.state.value }
          </div>
        ) 
      }
    </SampleConsumer>
  );
};
*/

const Receives = () => {
  return (
    <SampleConsumer>
      {
        ({state}) => (
          <div>
            현재 설정된 값: { state.value }
          </div>
        ) 
      }
    </SampleConsumer>
  );
}

export default Receives;