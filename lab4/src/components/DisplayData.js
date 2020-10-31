import React, {Component} from 'react';
import db from '../base';

class DisplayData extends Component {
    constructor(props) {
        super(props);

        this.state = {
            items: []
        };

        this.firebaseRef = db.database().ref("testclasses");
        this.firebaseRef.on('value', dataSnapshot => {
            let items = [];
            dataSnapshot.forEach(childSnapshot => {
                let item = childSnapshot.val();
                item['.key'] = childSnapshot.key;
                item['name'] = childSnapshot.key;
                // item['info'] = childSnapshot.key.child().child("discordInfo");
                items.push(item);
            });
            this.setState({items});
            console.log(items);
        });

    }
    componentWillUnmount() {
        this.firebaseRef.off();
    }

    render() {
        const records = this.state.items.map(items =>
            <tr key={items.key}>
                <td style={{width: '200px', textAlign: 'center'}}>{items.name}</td>
                <td style={{width: '200px', textAlign: 'center'}}>{items.info}</td>
            </tr>
        );

        return (
            <div style={{paddingTop: '20px'}}>
                <table style={{border: '1px solid black'}}>
                    <thead>
                    <tr>
                        <th>Friend's Name</th>
                        <th>Friend's Age</th>
                    </tr>
                    </thead>
                    <tbody>
                    {records}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default DisplayData;